export interface WasmBodyChunksExports {
  rewind?: () => void;
  next_body_chunk?: () => number;
}

export function joinBodyChunks(exports: WasmBodyChunksExports, memory: WebAssembly.Memory): string {
  const rewind = exports.rewind as () => void;
  const next_body_chunk = exports.next_body_chunk as () => number;

  const memoryBytes = new Uint8Array(memory.buffer);
  const utf8decoder = new TextDecoder();

  rewind();

  const chunks = [];
  //const chunks = new Uint8Array(1000);
  while (true) {
    const ptr = next_body_chunk();
    if (ptr === 0) {
      break;
    }

    // Search for null-terminating byte.
    const endPtr = memoryBytes.indexOf(0, ptr);
    // Get subsection of memory between start and end, and decode it as UTF-8.
    //return utf8decoder.decode(memoryBytes.subarray(ptr, endPtr));
    //chunks.concat(memoryToRead.subarray(0, count));
    chunks.push(memoryBytes.subarray(ptr, endPtr));
    //chunks.set(memoryBytes.subarray(ptr, endPtr), chunks.length);
  }

  // There surely must be a better way to do this.
  // See: https://stackoverflow.com/questions/49129643/how-do-i-merge-an-array-of-uint8arrays
  const bytes = new Uint8Array(chunks.map((chunk) => [...chunk]).flat());
  return utf8decoder.decode(bytes);
}
