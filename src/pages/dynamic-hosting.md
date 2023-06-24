---
layout: ../layouts/Page.astro
title: Hosting Dynamic WebAssembly
---

# Hosting Dynamic WebAssembly

You need two pieces:

1. An object store like AWS S3, Google Cloud Storage, or Cloudflare R1.
2. A cloud server.

## Deploying WebAssembly modules

A deploy is simply an upload to your object store.

I recommend calculating a SHA256 digest of the WebAssembly module and using that as its object store key.

e.g. `application/wasm/21ad2693870da89b201f445f75c6e3dac7b04ff91984d5ba17711857310939f9.wasm`

That way if you deploy a module that already exists, it can be skipped.

You’d then store the object’s key say in a database. On fetch, you’d look up the key, fetch the `.wasm` file for that key, and then execute it.

## Deno Deploy

You can import WebAssembly modules dynamically: fetch and then compile the module.

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
