export async function wasmInstantiate(url: string) {
  const res = await fetch(url);
  if (res.status >= 400) {
    throw res.status;
  }

  const sourceBytes = await res.arrayBuffer();

  const memory = new WebAssembly.Memory({ initial: 2 });
  const { instance } = await WebAssembly.instantiate(sourceBytes, {
    env: {
      buffer: memory,
    },
  });
  return { instance, memory, moduleByteLength: sourceBytes.byteLength };
}
