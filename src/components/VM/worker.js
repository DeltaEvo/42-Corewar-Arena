self.addEventListener("message", msg => {
  const { data } = msg;
  switch (data.topic) {
    case "start":
      start(data.url, data.buffers).then(res => self.postMessage(res));
      break;
  }
});

const decoder = new TextDecoder();

async function start(url, buffers) {
  const wmemory = new WebAssembly.Memory({
    initial: 256
  });

  const vm = {
    cycle: []
  };

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
    hook_process_adv(process, diff) {
      vm.cycle.push({
        action: "adv",
        process: (process - vm.processes_offset) / vm.process_size,
        diff
      });
    },
    hook_process_wait_opcode(process, opcode) {
      vm.cycle.push({
        action: "wait_opcode",
        process: (process - vm.processes_offset) / vm.process_size,
        opcode
      });
    },
    hook_cycle_end() {
      self.postMessage(vm.cycle);
      vm.cycle = [];
    }
  };

  // Bintray dont set mime type so we can't use instantiateStreaming
  const { instance } = await WebAssembly.instantiate(
    await (await fetch(url)).arrayBuffer(),
    {
      env
    }
  );

  const {
    get_vm_mem_size,
    get_process_size,
    create_vm,
    get_vm_mem,
    get_vm_vec,
    get_vm_vec_processes,
    add_process,
    init_process,
    david_needs_to_work
  } = instance.exports;

  const MEM_SIZE = get_vm_mem_size();
  vm.MEM_SIZE = MEM_SIZE;

  console.log("MEM_SIZE", MEM_SIZE);

  vm.pointer = create_vm();
  vm.processes_offset = get_vm_vec_processes(vm.pointer);
  vm.mem_offset = get_vm_mem(vm.pointer);
  vm.process_size = get_process_size();

  console.log("Size", vm.process_size);

  console.log(memory.byteLength);

  const vec = get_vm_vec(vm.pointer);
  for (const [i, abuffer] of buffers.entries()) {
    const buffer = new Uint8Array(abuffer);
    const process = add_process(vec);
    const offset = (MEM_SIZE / buffers.length) * i;
    init_process(process, offset, i);
    vm.cycle.push({
      action: "spawn",
      offset
    });
    memory.set(buffer, vm.mem_offset + offset);
  }
  setTimeout(() => david_needs_to_work(vm.pointer), 0);
  return { MEM_SIZE };
}
