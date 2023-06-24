---
layout: ../layouts/Page.astro
title: Hosting Dynamic WebAssembly
---

# Hosting Dynamic WebAssembly

You need two pieces:

1. An object store like AWS S3, Google Cloud Storage, or Cloudflare R1. Here you upload each `.wasm` module immutably using its digest as the key.
2. A cloud server which supports dynamic instantiation of WebAssembly modules.

## Immutable deploys

A deploy is simply an upload to your object store.

I recommend calculating a SHA256 digest of the WebAssembly module and using that as its object store key.

e.g. `application/wasm/388b/sha256-21ad2693870da89b201f445f75c6e3dac7b04ff91984d5ba17711857310939f9.wasm`

That way if you deploy a module that already exists, it can be skipped. And every previous deploy has its WebAssembly kept around, which is great for rollbacks, preview deploys, and speeding up future deploys via reuse.

Here’s how you’d generate this key using JavaScript from a WebAssembly module’s byte array:

```ts
function calculateWasmKey(wasmModuleBytes: ArrayBuffer) {
	const sha256 = await crypto.subtle.digest("SHA-256", wasmModuleBytes);
	const sha256Hex = sha256.map((b) => b.toString(16).padStart(2, "0")).join("");
	return `application/wasm/${wasmModuleBytes.byteLength}b/sha256-${sha256Hex}.wasm`;
}
```

You’d then store the object’s key say in a database. On fetch, you’d look up the key, fetch the `.wasm` file for that key, and then execute it.

Examples (coming soon) are provided which do this for you.

----

## Deno Deploy

You can import WebAssembly modules dynamically: fetch and then compile the module.

```js
const wasmObjectKey = … // e.g. read from ENV variable or database or URL

const url = `https://storage.googleapis.com/your-bucket-name/${wasmObjectKey}`;
const res = await fetch(url);
if (res.status >= 400) {
  return new Response(`Status: ${res.status}`, {
	headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

const imports = {};
const { instance } = await WebAssembly.instantiate(await res.arrayBuffer(), imports);
const memory = instance.exports.memory;

// Call exported functions…
```

## Vercel

- https://github.com/vercel-community/deno
- https://github.com/vercel-community/rust and Wasmtime
- https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/go and https://github.com/tetratelabs/wazero

## Lambda

- Deno
- Rust
- Golang

## Google Cloud Functions

- https://cloud.google.com/functions/docs/runtime-support

## Deno + Docker

- https://deno.com/manual/advanced/deploying_deno/google_cloud_run

## Google Cloud Run

- https://deno.com/manual/advanced/deploying_deno/google_cloud_run
