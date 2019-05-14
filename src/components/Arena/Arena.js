import { Scene, AmbientLight, Color } from "three";
import TDSLoader from "three/examples/js/loaders/TDSLoader";
import Background from "./Background";

import Memory, { COLORS } from "./Memory";

const loader = new TDSLoader();
const model = new Promise(resolve => loader.load("/process.3ds", resolve));

export default class Arena extends Scene {
  constructor() {
    super();

    this.memory = new Memory(4096);
    this.add(this.memory);
    this.add(new AmbientLight());
    this.add(new Background());
    this.processes = [];

    model.then(model => (this.model = model));

    this.background = new Color(0x404040);
  }

  run(cycle) {
    for (const action of cycle) {
      if (action.action === "spawn") {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const object = this._createProcess(color);
        this.memory.placeObject(object, action.offset);
        this.processes.push({
          object,
          pc: action.offset,
          color,
          visible: true
        });
        this.add(object);
      }
      if (action.action === "adv") {
        const process = this.processes[action.process];
        if (!process) continue;
        process.pc += action.diff;
        process.pc %= 4096;
        this.memory.placeObject(process.object, process.pc);
      }
      if (action.action === "wait_opcode") {
        //if (action.opcode >= 0) console.log("Op", action.opcode);
      }
      if (action.action === "write_memory") {
        const process = this.processes[action.process];
        if (!process) continue;
        for (let i = 0; i < action.memory.length; i++) {
          this.memory.set(i + action.from, process.color, action.memory[i]);
        }
      }
    }
    //this._optimizeProcesses();
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

  _optimizeProcesses() {
    const positions = [];
    for (const process of this.processes) {
      if (positions.indexOf(process.pc % 4096) == -1) {
        positions.push(process.pc % 4096);
        if (!process.visible) {
          this.add(process.object);
          process.visible = true;
        }
      } else if (process.visible) {
        this.remove(process.object);
        process.visible = false;
      }
    }
    console.log("Visible", positions.length);
  }
}
