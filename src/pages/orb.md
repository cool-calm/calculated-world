---
layout: ../layouts/Page.astro
title: "Orb: a WebAssembly DSL in Elixir"
---

# Orb: a WebAssembly DSL in Elixir

- [Docs](https://hexdocs.pm/orb/Orb.html)
- [GitHub repo](https://github.com/RoyalIcing/Orb)

## Examples

```elixir
defmodule Mean do
  use Orb

  I32.global(sum: 0, count: 0)

  wasm do
    func insert(n: I32) do
      @count = @count + 1
      @sum = @sum + n
    end

    func calculate_mean(), I32 do
      @sum / @count
    end
  end
end
```

```elixir
alias OrbWasmtime.Instance, as: Wasmtime

a = Wasmtime.run(Mean)
Wasmtime.call(a, :insert, 3)
Wasmtime.call(a, :insert, 4)
Wasmtime.call(a, :insert, 5)
Wasmtime.call(a, :insert, 6)
Wasmtime.call(a, :insert, 7)
Wasmtime.call(a, :calculate_mean)
# 5
```
