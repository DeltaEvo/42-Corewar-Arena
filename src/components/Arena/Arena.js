import { Scene, AmbientLight, Color, AnimationMixer } from "three";
import Background from "./Background";

import Memory, { COLORS } from "./Memory";
import { Tween } from "es6-tween";

const INSTRUCTIONS = new Map([
  [
    0x01,
    {
      name: "live"
    }
  ],
  [
    0x02,
    {
      name: "ld"
    }
  ],
  [
    0x03,
    {
      name: "st"
    }
  ],
  [
    0x04,
    {
      name: "add"
    }
  ],
  [
    0x05,
    {
      name: "sub"
    }
  ],
  [
    0x06,
    {
      name: "and"
    }
  ],
  [
    0x07,
    {
      name: "or"
    }
  ],
  [
    0x08,
    {
      name: "xor"
    }
  ],
  [
    0x09,
    {
      name: "xjmp"
    }
  ],
  [
    0x09,
    {
      name: "zjmp"
    }
  ],
  [
    0x0a,
    {
      name: "ldi"
    }
  ],
  [
    0x0b,
    {
      name: "sti"
    }
  ],
  [
    0x0c,
    {
      name: "fork"
    }
  ],
  [
    0x0d,
    {
      name: "lld"
    }
  ],
  [
    0x0e,
    {
      name: "lldi"
    }
  ],
  [
    0x0f,
    {
      name: "lfork"
    }
  ],
  [
    0x10,
    {
      name: "aff"
    }
  ]
]);

export default class Arena extends Scene {
  constructor(models) {
    super();

    this.memory = new Memory(4096);
    this.add(this.memory);
    this.add(new AmbientLight());
    this.add(new Background());
    this.processes = [];
    this.mixers = [];

    this.models = models;
    this.background = new Color(0x404040);
  }

  updateTime(delta) {
    for (const mixer of this.mixers) mixer.update(delta / 10);
  }

  run(cycle, time, onUnhandled = () => {}) {
    for (const action of cycle) {
      if (action.action === "spawn") {
        const color =
          action.parent !== undefined
            ? this.processes[action.parent].color
            : COLORS[this.processes.length];
        const object = this._createProcess(color);
        this.memory.placeObject(object, action.offset);
        this.processes.push({
          object,
          pc: action.offset,
          color,
          visible: true
        });
        this.add(object);
      } else if (action.action === "adv") {
        const process = this.processes[action.process];
        const tmp = { pc: process.pc };
        if (process.tween) process.tween.stop();
        process.tween = new Tween(tmp)
          .to({ pc: process.pc + action.diff }, 5)
          .on("update", () => {
            this.memory.placeObject(process.object, tmp.pc);
          })
          .on("complete", () => {
            this.memory.placeObject(process.object, process.pc);
          })
          .on("stop", () => {
            this.memory.placeObject(process.object, process.pc);
          });
        process.pc += action.diff;
        process.pc %= 4096;
        process.tween.start(time);
      } else if (action.action === "wait_opcode") {
        const process = this.processes[action.process];
        if (INSTRUCTIONS.has(action.opcode)) {
          const { name } = INSTRUCTIONS.get(action.opcode);

          console.log("Run", name);
          if (name === "st") {
            const ring = this.models.ring_yellow.object.clone();
            const normal = this.memory.placeObject(ring, process.pc);
            ring.position.add(normal.multiplyScalar(0.05));
            const mixer = new AnimationMixer(ring);

            mixer.clipAction(this.models.ring_yellow.animations[0]).play();
            this.mixers.push(mixer);
            if (process.tween) process.tween.stop();
            process.tween = new Tween({ x: 0 })
              .to({ x: 1 }, 5)
              .on("start", () => {
                this.add(ring);
              })
              .on("complete", () => {
                this.remove(ring);
                mixer.stopAllAction();
                this.mixers.splice(this.mixers.indexOf(mixer), 1);
              })
              .on("stop", () => {
                this.remove(ring);
                mixer.stopAllAction();
                this.mixers.splice(this.mixers.indexOf(mixer), 1);
              })
              .start(time);
          }
          if (name === "fork") {
            const normal = this.memory.placeObject(null, process.pc);
            if (process.tween) process.tween.stop();
            const scale = process.object.scale.clone();
            const end = () => {
              process.object.scale.copy(scale);
            };
            process.tween = new Tween(process.object)
              .to(
                {
                  position: process.object.position.clone().add(normal),
                  scale: scale.clone().multiplyScalar(2)
                },
                800
              )
              .on("complete", end)
              .on("stop", end)
              .start(time);
          }
        } else console.log("Unknown instruction", action.opcode);
      } else if (action.action === "write_memory") {
        const process = this.processes[action.process];
        for (let i = 0; i < action.memory.length; i++) {
          this.memory.set(i + action.from, process.color, action.memory[i]);
        }
      } else if (action.action === "jump") {
        const process = this.processes[action.process];
        process.pc = action.offset;
        this.memory.placeObject(process.object, process.pc);
      } else onUnhandled(action);
    }
    //this._optimizeProcesses();
  }

  _createProcess(color) {
    const object = this.models.process.clone();

    for (const mesh of object.children) {
      if (mesh.material.name === "Orange") {
        mesh.material = mesh.material.clone();
        mesh.material.color.set(color);
      }
    }

    object.rotateZ(Math.PI);
    object.scale.multiplyScalar(0.055);
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
