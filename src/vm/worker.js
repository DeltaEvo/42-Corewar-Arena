self.addEventListener("message", msg => {
  const { data } = msg;
  switch (data.topic) {
    case "start":
      start(data.buffers).then(res => self.postMessage(res));
      break;
  }
});

const decoder = new TextDecoder();

async function start(buffers) {
  const wmemory = new WebAssembly.Memory({
    initial: 256
  });

  const memory = new Uint8Array(wmemory.buffer);

  const env = {
    memory: wmemory,
    write(fd, address, size) {
      const msg = decoder.decode(memory.slice(address, address + size));
      console.log("Write", msg);
    },
    printf() {
      console.log("Printf", arguments);
    },
    exit() {
      console.log("Exit", arguments);
    },
    start_op(op) {
      self.postMessage({ op });
    }
  };

  const { instance } = await WebAssembly.instantiateStreaming(
    fetch("/vm.wasm"),
    {
      env
    }
  );

  const {
    get_vm_mem_size,
    create_vm,
    get_vm_mem,
    get_vm_vec,
    add_process,
    init_process,
    david_needs_to_work
  } = instance.exports;

  const MEM_SIZE = get_vm_mem_size();

  console.log("MEM_SIZE", MEM_SIZE);

  const vm = create_vm();
  const processes = get_vm_vec(vm);
  const mem_offset = get_vm_mem(vm);

  console.log(memory.byteLength);

  for (const [i, abuffer] of buffers.entries()) {
    const buffer = new Uint8Array(abuffer);
    const process = add_process(processes);
    const offset = (MEM_SIZE / buffers.length) * i;
    init_process(process, offset, i);
    memory.set(buffer, mem_offset + offset);
  }
  david_needs_to_work(vm);
}
