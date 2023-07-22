---
layout: ../layouts/Page.astro
title: Why WebAssembly?
---

# Why WebAssembly?

- Runs on every major platform:
    - Browsers: Chrome, Safari, Firefox
    - Servers: Golang, Python, Node.js, C#, Java, Rust
    - Edge: Cloudflare, Vercel, Fastly, Deno Deploy
    - Mobile: Swift on iOS/iPadOS/macOS & Java on Android
- Web standard:
    - Well specced
    - Backwards compatible
    - Multiple competing implementations
    - Many big players
- Sandboxed:
    - Can’t read outside of its memory
    - Calls to outside its system must be explicitly provided as ‘imports’
    - Can be CPU limited to run to a certain deadline or ‘fuel’ limit
- Fast & light:
    - Can be interpreted quickly
    - Can be just-in-time compiled to a particular CPU architecture
    - Fast to instantiate
    - Low memory footprint
- Reliable:
    - Deterministic: Given the same module with the same inputs, the same output will be produced
    - If a WebAssembly instance traps, it won’t take down your whole system
