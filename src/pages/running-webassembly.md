---
layout: ../layouts/Page.astro
title: How to run WebAssembly modules
---

# How to run WebAssembly modules

## Browser

Inherently given WebAssembly’s name, the natural target is the web. You can load and execute a module in the browser using `WebAssembly.instantiateStreaming()` like so:

```js
const { instance } = await WebAssembly.instantiateStreaming(fetch("square.wasm"));
const { exports } = instance;
const answer = exports.square(9);
console.log(answer); // 81
```

## Deno

Deno uses the same approach to the browser:

```js
const { instance } = await WebAssembly.instantiateStreaming(fetch("square.wasm"));
const { exports } = instance;
const answer = exports.square(9);
console.log(answer); // 81
```

Deno is what I host [this site](/) using.

## Next.js Edge

In Next.js you [import then instantiate the wasm module](https://nextjs.org/docs/messages/middleware-dynamic-wasm-compilation) like so:

```js
import squareWasm from './square.wasm?module'

export default async function middleware() {
  const { exports } = await WebAssembly.instantiate(squareWasm)
  const answer = exports.square(9);
  console.log(answer); // 81
}
```

## Node.js

```js
const fs = require('fs');

const wasmBytes = fs.readFileSync('/square.wasm');
WebAssembly.instantiate(wasmBytes).then(({ instance }) => {
  const { exports } = instance;
  const answer = exports.square(9);
  console.log(answer); // 81
});
```

## Elixir

- `orb_wasmtime` or `wasmtime_ex`

## Rust

- Wasmtime

## Golang

- https://github.com/tetratelabs/wazero

## .NET, Elixir, Ruby, C

For other languages Wasmtime is well-supported library for [many languages](https://docs.wasmtime.dev/lang.html).
