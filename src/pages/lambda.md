---
layout: ../layouts/Page.astro
title: Run WebAssembly on AWS Lambda
---

# Run WebAssembly on AWS Lambda

AWS Lambda is a compelling model — upload your executable and then AWS will handle the spinning up (and spinning down) of servers.

The biggest problem I’ve faced with it is the cold-start problem. The time taken to spin up that server can be noticeable, negatively affecting the user experience.

One thing I’ve always heard is that Rust on Lambda is really quick, and effectively is so quick that it doesn’t have the cold start problem.

So what would a Rust app with the Wasmtime WebAssembly runtime look like? Could we have dynamic code but near the speed of Rust?

Coming soon…
