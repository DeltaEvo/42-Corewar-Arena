import {
  Scene,
  AnimationMixer,
  DirectionalLight,
  MeshPhongMaterial
} from "three";
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

const LIGHTS = [{ x: 0, y: 0, z: 100 }, { x: 0, y: 0, z: -100 }];

export default class Arena extends Scene {
  constructor(models, champions) {
    super();

    this.memory = new Memory(4096);
    this.add(this.memory);
    for (const position of LIGHTS) {
      const light = new DirectionalLight(0xffffff);
      Object.assign(light.position, position);
      this.add(light);
    }
    this.add((this.sky = new Background()));
    this.processes = [];
    this.mixers = [];

    this.models = models;
    this.champions = champions;
  }

  updateTime(delta) {
    for (const mixer of this.mixers) mixer.update(delta / 10);
  }

  run(cycle, time, onUnhandled = () => {}, onLive = () => {}) {
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
      } else if (action.action === "read_opcode") {
        const process = this.processes[action.process];
        if (INSTRUCTIONS.has(action.opcode)) {
          const { name } = INSTRUCTIONS.get(action.opcode);

          //console.log("Run", name);
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
                  scale: scale.clone().multiplyScalar(1.5)
                },
                800
              )
              .on("complete", end)
              .on("stop", end)
              .start(time);
          }
        } //else console.log("Unknown instruction", action.opcode);
      } else if (action.action === "live") {
        const process = this.processes[action.process];

        const heart = this.models.heart.clone();
        if (action.player >= 1 && action.player <= this.champions.length) {
          heart.children[0].material = new MeshPhongMaterial({
            color: this.processes[action.player - 1].color
          });
        }
        const normal = this.memory.placeObject(heart, process.pc);
        const scale = heart.scale.clone();
        const end = () => {
          this.remove(heart);
        };
        const data = {
          position: heart.position,
          scale: heart.scale,
          rotation: 0
        };
        let lastRotation = 0;
        new Tween(data)
          .to(
            {
              position: heart.position.clone().add(normal),
              scale: scale.clone().multiplyScalar(2),
              rotation: Math.PI * 2
            },
            100
          )
          .on("update", () => {
            heart.rotateZ(data.rotation - lastRotation);
            lastRotation = data.rotation;
          })
          .on("complete", end)
          .on("stop", end)
          .on("start", () => this.add(heart))
          .start(time);
        onLive(action.player);
      } else if (action.action === "die") {
        if (this.processes[action.process].tween)
          this.processes[action.process].tween.stop();
        const { color, object } = this.processes[action.process];
        this.remove(object);
        this.processes[action.process] = { color };
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
      if (mesh.material.name === "Orange-effect") {
        mesh.material = mesh.material.clone();
        mesh.material.color.set(color);
      }
    }

    object.rotateZ(Math.PI);

    return object;
    /*const geometry = new BoxGeometry(0.25, 0.25, 0.25);
    const material = new MeshBasicMaterial({ color });
    const cube = new Mesh(geometry, material);
    return cube;
    return new Object3D();*/
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
