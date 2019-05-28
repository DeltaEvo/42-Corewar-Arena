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
  const memory = new WebAssembly.Memory({
    initial: 2
  });

  const vm = {
    cycle: []
  };

  const env = {
    memory,
    write(fd, address, size) {
      const msg = decoder.decode(
        new Uint8Array(memory.buffer).slice(address, address + size)
      );
      console.log("Write", msg);
    },
    printf() {
      console.log("Printf", arguments);
    },
    exit() {
      console.log("Exit", arguments);
    },
    hook_process_adv(_vm, process, diff) {
      vm.cycle.push({
        action: "adv",
        process: (process - vm.processes_offset) / vm.process_size,
        diff
      });
    },
    hook_process_jump(_vm, process, _try, offset) {
      if (offset) {
        vm.cycle.push({
          action: "jump",
          process: (process - vm.processes_offset) / vm.process_size,
          offset
        });
      }
    },
    hook_process_read_opcode(process, opcode) {
      vm.cycle.push({
        action: "read_opcode",
        process: (process - vm.processes_offset) / vm.process_size,
        opcode
      });
    },
    hook_process_spawn(process, parent, offset) {
      vm.cycle.push({
        action: "spawn",
        process: (process - vm.processes_offset) / vm.process_size,
        parent: (parent - vm.processes_offset) / vm.process_size,
        offset
      });
    },
    hook_process_live(_vm, process, player) {
      vm.cycle.push({
        action: "live",
        process: (process - vm.processes_offset) / vm.process_size,
        player
      });
    },
    hook_process_die(_vm, process) {
      vm.cycle.push({
        action: "die",
        process: (process - vm.processes_offset) / vm.process_size
      });
    },
    hook_process_memory_write(process, offset, size) {
      const buffer = new Uint8Array(size);
      const mem = new Uint8Array(memory.buffer, vm.mem_offset, vm.MEM_SIZE);
      while (offset < 0) offset += vm.MEM_SIZE;
      offset %= vm.MEM_SIZE;
      if (offset + size > vm.MEM_SIZE) {
        const diff = vm.MEM_SIZE - offset;
        buffer.set(mem.slice(offset, vm.MEM_SIZE), 0);
        buffer.set(mem.slice(0, size - diff), diff);
      } else buffer.set(mem.slice(offset, offset + size));
      new Uint8Array(memory.buffer).set(buffer, vm.mem_offset + offset);
      vm.cycle.push({
        action: "write_memory",
        process: (process - vm.processes_offset) / vm.process_size,
        from: offset,
        memory: buffer
      });
    },
    hook_cycle_to_die(_vm, value) {
      vm.cycle.push({
        action: "cycle_to_die",
        value: Math.max(0, value) // TODO: fix on vm
      });
    },
    hook_cycle_end() {
      self.postMessage(vm.cycle);
      vm.cycle = [];
      return true;
    },
    hook_win(_vm, winner) {
      vm.cycle.push({
        action: "win",
        winner
      });
      self.postMessage(vm.cycle);
    }
  };

  const { instance } = await WebAssembly.instantiateStreaming(fetch(url), {
    env
  });

  const {
    get_vm_mem_size,
    get_cycle_to_die,
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
      process: i,
      offset
    });
    vm.cycle.push({
      action: "write_memory",
      process: i,
      from: offset,
      memory: buffer
    });
    new Uint8Array(memory.buffer).set(buffer, vm.mem_offset + offset);
  }
  vm.cycle.push({
    action: "cycle_to_die",
    value: get_cycle_to_die()
  });
  function loop() {
    if (!david_needs_to_work(vm.pointer, 1)) setTimeout(loop, 0);
    else {
      self.close();
    }
  }
  loop();
  return { MEM_SIZE };
}
