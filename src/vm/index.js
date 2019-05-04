import Worker from "worker-loader!./worker.js";
import { readHeader } from "./bytecode";

export class VM {
  constructor() {
    this.champions = [];
    this.started = false;
  }
  loadChampion(buffer) {
    if (this.started) throw new Error("VM Already started");
    const { name, comment, offset, size } = readHeader(new DataView(buffer));
    if (buffer.byteLength != offset + size) throw new Error("Invalid size");
    this.champions.push({
      name,
      comment,
      buffer: buffer.slice(offset)
    });
  }
  async start() {
    this.worker = new Worker();
    this.worker.onmessage = msg => {
      console.log("MSG", msg.data);
    };
    const buffers = this.champions.map(({ buffer }) => buffer);
    const { MEM_SIZE } = await new Promise(resolve => {
      const handler = msg => {
        resolve(msg.data);
        this.worker.removeEventListener("message", handler);
      };
      this.worker.addEventListener("message", handler);
      this.worker.postMessage({ topic: "start", buffers }, buffers);
    });
    this.MEM_SIZE = MEM_SIZE;
    this.started = true;
  }
}

/*function selectFile() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();
  return new Promise(
    resolve => (input.onchange = e => resolve(e.target.files[0]))
  );
}

window.addEventListener("click", async () => {
  const file = await selectFile();
  const arrayBuffer = await new Response(file).arrayBuffer();
  const vm = new VM();
  vm.loadChampion(arrayBuffer);
  await vm.start();
});*/
