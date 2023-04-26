import * as shiki from "shiki";

export async function fixShikiDeno() {
    const responseWasm = await fetch("https://unpkg.com/shiki/dist/onig.wasm");
    const wasmArrayBuffer = await responseWasm.arrayBuffer();
    shiki.setWasm(wasmArrayBuffer);
    shiki.setCDN("https://unpkg.com/shiki/");
}