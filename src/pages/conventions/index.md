---
layout: ../../layouts/Page.astro
title: WebAssembly Module Conventions
---
# WebAssembly Module Conventions

Here are some lightweight conventions that WebAssembly modules can use as an interface to integrate with the ecosystem. Where possible, they make use of existing standards like UTF-8, MIME, HTML, HTTP.

## Strings

String are nul-terminated UTF-8.

An example of a constant data string in WebAssembly text format:

```wasm
(data $html_doctype "<!doctype html>\00")
```

## HTML Component (chunked)

```wasm
(data (i32.const 0x1024) "text/html\00")

(func (export "media_type") (result i32)
    (i32.const 0x1024)
)

(func (export "next_body_chunk") (result i32)
    …
)
```

**Must** export a function called `media_type` which returns an `i32` offset to `"text/html"` in main memory as a nul-terminated UTF-8 string.

**Must** export a function called `next_body_chunk`, which returns either an `i32` offset to a nul-terminated UTF-8 string in main memory, or `0` when it’s done. This function will be called multiple times, allowing HTML content to be streamed out.

## Simple HTTP server

TODO
