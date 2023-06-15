class WasmHTML extends HTMLElement {
    static get observedAttributes() { return ['globals']; }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === "globals") {
            const { exports, update } = await this.main;
            const newValues = new Map(Object.entries(JSON.parse(newValue)));
            console.log(newValues)

            for (const [key, value] of newValues) {
                if (typeof value === "number") {
                    exports[key].value = value;
                }
                else if (typeof value === "string") {
                    const int = parseInt(value);
                    console.log("set", key, int)
                    if (!Number.isNaN(int)) {
                        exports[key].value = int;
                    }
                }
            }

            update();
        }
    }

    constructor() {
        super();

        console.log("connectedCallback");
        const wasmURL = this.dataset.url ?? this.getAttribute("src") ?? this.querySelector("source[type='application/wasm']")?.src;
        if (wasmURL) {
            const wasmModulePromise = WebAssembly.compileStreaming(fetch(wasmURL, { credentials: "omit" }));

            const makeInstancePromise = wasmModulePromise.then(module => {
                console.log("MODULE", module);
                return async function makeInstance() {
                    const memory = new WebAssembly.Memory({ initial: 2 });
                    const instance = await WebAssembly.instantiate(module, {
                        env: {
                            buffer: memory
                        }
                    });
                    return ({ instance, memory });
                }
            });

            this.main = initWasmHTML(this, makeInstancePromise);
        }

        const importUrl = this.dataset.importUrl ?? this.querySelector("source[type='text/javascript']")?.src;
        if (importUrl) {
            const wasmModulePromise = window.importModule(importUrl);
            console.log("import(importUrl)", wasmModulePromise);
            const makeInstancePromise = wasmModulePromise
                .then(exports => {
                    console.log("Loaded wasm via import()", Date.now() - window.startTime);
                    console.log("ES MODULE", exports);
                    return exports.wasmModulePromise;
                })
                .then(module => {
                    console.log("MODULE", module);
                    return async function makeInstance() {
                        const memory = new WebAssembly.Memory({ initial: 2 });
                        const instance = await WebAssembly.instantiate(module, {
                            env: {
                                buffer: memory
                            }
                        });
                        return ({ instance, memory });
                    }
                });

            this.main = initWasmHTML(this, makeInstancePromise);
        }
    }
}

async function initWasmHTML(el, makeInstancePromise) {
    const makeInstance = await makeInstancePromise;
    let { instance, memory } = await makeInstance();
    console.log("im", instance, memory)

    const memoryBytes = new Uint8Array(memory.buffer);
    const utf8decoder = new TextDecoder();

    function update() {
        const rewind = instance.exports.rewind;
        const next_body_chunk = instance.exports.next_body_chunk;
        rewind();

        const chunks = [];
        //const chunks = new Uint8Array(1000);
        while (true) {
            const ptr = next_body_chunk();
            if (ptr === 0) {
                break;
            }

            // Search for null-terminating byte.
            const endPtr = memoryBytes.indexOf(0, ptr);
            // Get subsection of memory between start and end, and decode it as UTF-8.
            //return utf8decoder.decode(memoryBytes.subarray(ptr, endPtr));
            //chunks.concat(memoryToRead.subarray(0, count));
            chunks.push(memoryBytes.subarray(ptr, endPtr));
            //chunks.set(memoryBytes.subarray(ptr, endPtr), chunks.length);
        }

        // There surely must be a better way to do this.
        // See: https://stackoverflow.com/questions/49129643/how-do-i-merge-an-array-of-uint8arrays
        const bytes = new Uint8Array(chunks.map(chunk => [...chunk]).flat());
        const html = utf8decoder.decode(bytes);
        el.innerHTML = html;
    }

    el.addEventListener("click", (event) => {
        const action = event.target.dataset.action;
        if (typeof action === "string") {
            instance.exports[action]?.apply();
        }
        update();
    });

    queueMicrotask(update);

    el.dataset.ready = "";

    return { exports: instance.exports, update };
}

customElements.define("wasm-html", WasmHTML);

export const tagName = "wasm-html";
