import Worker from "worker-loader!./worker.js";
import { readHeader } from "./bytecode";

export default class VM {
  constructor() {
    this.champions = [];
    this.started = false;
    this.cycles = [];
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
  async start(url) {
    this.worker = new Worker();
    this.worker.onmessage = msg => {
      if (Array.isArray(msg.data)) this.cycles.push(msg.data);
    };
    const buffers = this.champions.map(({ buffer }) => buffer);
    const { MEM_SIZE } = await new Promise(resolve => {
      const handler = msg => {
        resolve(msg.data);
        this.worker.removeEventListener("message", handler);
      };
      this.worker.addEventListener("message", handler);
      this.worker.postMessage({ topic: "start", buffers, url }, buffers);
    });
    this.MEM_SIZE = MEM_SIZE;
    this.started = true;
  }
}
