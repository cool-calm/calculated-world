---
layout: ../layouts/Page.astro
title: WebAssembly HTML Custom Elements
---

# WebAssembly HTML Custom Elements

### `<wasm-html>` custom element

Load and run WebAssembly in the browser, using it to render interactive HTML.

Usage:

```html
<wasm-html src="https://collected.world/counter.wasm">
</wasm-html>

<!-- Or -->
<wasm-html>
  <source src="https://collected.world/counter.wasm" type="application/wasm">
</wasm-html>
```

You can include server-rendered initial HTML:

```html
<wasm-html src="https://collected.world/counter.wasm">
  <div>Some initial HTML or loading indicator</div>
</wasm-html>
```

Implementation:

```javascript
class WasmHTML extends HTMLElement {
  connectedCallback() {
    const wasmURL = this.getAttribute("src") ?? this.querySelector("source[type='application/wasm']")?.src;
    if (wasmURL) {
      const wasmInstancePromise = WebAssembly.instantiateStreaming(fetch(wasmURL, { credentials: "omit" }));
      initWasmHTML(this, wasmInstancePromise);
    }

    throw Error("You must pass a src attribute or have a <source> child.");
  }
}

function initWasmHTML(el, wasmInstancePromise) {
  wasmInstancePromise.then(({ instance }) => {
    const memory = instance.exports.memory;
    const rewind = instance.exports.rewind;
    const next_body_chunk = instance.exports.next_body_chunk;

    const memoryBytes = new Uint8Array(memory.buffer);
    const utf8decoder = new TextDecoder();

    function update() {
      rewind?.call();

      const chunks = [];
      while (true) {
        const ptr = next_body_chunk();
        if (ptr === 0) {
          break;
        }

        // Search for null-terminating byte.
        const endPtr = memoryBytes.indexOf(0, ptr);
        // Get subsection of memory between start and end, and decode it as UTF-8.
        chunks.push(memoryBytes.subarray(ptr, endPtr));
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
  });
}

customElements.define("wasm-html", WasmHTML);
```

### `<WasmHTML>` React

```jsx
<WasmHTML src="https://collected.world/counter.wasm" />
```

### `<WasmHTML>` Vue

## `<wasm-state-machine>` custom element

## `<wasm-string-builder>` custom element
