import { Scene, AmbientLight, Color } from "three";
import TDSLoader from "three/examples/js/loaders/TDSLoader";

import Memory from "./Memory";

const loader = new TDSLoader();
const model = new Promise(resolve => loader.load("/process.3ds", resolve));

export default class Arena extends Scene {
  constructor() {
    super();

    this.memory = new Memory(4096);
    this.add(this.memory);
    this.add(new AmbientLight());
    this.processes = [];

    model.then(model => (this.model = model));

    this.background = new Color(0x404040);
  }

  run(cycle) {
    for (const action of cycle) {
      if (action.action === "spawn") {
        const object = this._createProcess(0xffffff * Math.random());
        this.memory.placeObject(object, action.offset);
        this.processes.push({
          object,
          pc: action.offset
        });
        this.add(object);
      }
      if (action.action === "adv") {
        const process = this.processes[action.process];
        process.pc += action.diff;
        process.pc %= 4096;
        this.memory.placeObject(process.object, process.pc);
        this.memory.set(process.pc, 0xff, 1);
      }
      if (action.action === "wait_opcode") {
        if (action.opcode >= 0) console.log("Op", action.opcode);
      }
    }
  }

  _createProcess(color) {
    const object = this.model.clone();

    for (const mesh of object.children) {
      if (mesh.material.name === "Orange") {
        mesh.material = mesh.material.clone();
        mesh.material.color.set(color);
      }
    }

    object.rotateZ(Math.PI);
    object.scale.multiplyScalar(0.075);
    return object;
  }
}
