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

  defw insert(n: I32) do
    @count = @count + 1
    @sum = @sum + n
  end

  defw calculate_mean(), I32 do
    @sum / @count
  end
end
```

```elixir
alias OrbWasmtime.Instance, as: Wasmtime

wid = Wasmtime.run(Mean)
Wasmtime.call(wid, :insert, 3)
Wasmtime.call(wid, :insert, 4)
Wasmtime.call(wid, :insert, 5)
Wasmtime.call(wid, :insert, 6)
Wasmtime.call(wid, :insert, 7)
Wasmtime.call(wid, :calculate_mean)
# 5
```
