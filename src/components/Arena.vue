<template>
  <canvas></canvas>
</template>

<script>
import { WebGLRenderer, PerspectiveCamera, Vector2 } from "three";
import Arena from "./Arena/Arena.js";
import { loadModels } from "./Arena/Models.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { update as tweenUpdate } from "es6-tween";

import ResizeObserver from "resize-observer-polyfill";

const FOV = 70;
const NEAR = 0.1;
const FAR = 1000;

export default {
  props: ["wireframe", "colorMode", "cycles", "cyclesPerSecond", "champions"],
  async mounted() {
    const { clientWidth: width, clientHeight: height } = this.$el;

    this.renderer = new WebGLRenderer({
      canvas: this.$el,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.setSize(width, height);
    this.$el.style = "";

    this.camera = new PerspectiveCamera(FOV, width / height, NEAR, FAR);
    this.camera.position.z = 15;

    this.camera_reverse = new PerspectiveCamera(FOV, width / height, NEAR, FAR);

    this.observer = new ResizeObserver(() => {
      const { clientWidth: width, clientHeight: height } = this.$el;

      this.renderer.setSize(width, height);
      this.$el.style = "";
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });
    this.observer.observe(this.$el);

    const controls = new OrbitControls(this.camera, this.$el);
    controls.maxDistance = 100;
    controls.enablePan = false;

    this.scene = window.scene = new Arena(await loadModels(), this.champions);
    this.scene.memory.wireframe = this.wireframe;
    this.scene.memory.colorMode = this.colorMode;

    this.render();
    this.cycle = 0;
  },
  computed: {
    cycleMs() {
      return 1000 / this.cyclesPerSecond;
    }
  },
  methods: {
    render(timestamp) {
      this.raf = requestAnimationFrame(this.render);
      if (!this.last_cycle) this.last_cycle = timestamp;
      const cyclesToRun = (timestamp - this.last_cycle) / this.cycleMs;
      const currentCycle = this.cycle;
      for (let i = 0; i < Math.floor(cyclesToRun) && this.cycles.length; i++) {
        this.scene.run(this.cycles.shift(), ++this.cycle, action => {
          if (action.action == "cycle_to_die")
            this.$emit("cycleDie", action.value);
          else console.log("Unhandled", action);
        });
        this.$emit("cycle");
        this.last_cycle += this.cycleMs;
      }
      this.$emit("processes", this.scene.processes.filter(e => e).length);
      tweenUpdate(currentCycle + cyclesToRun);
      this.scene.updateTime(cyclesToRun);
      const size = new Vector2();
      this.renderer.getSize(size);
      const xMargin = size.x < size.y ? 0 : 1;
      const yMargin = size.y < size.x ? 0 : 1;
      const xSplit = size.x < size.y ? 1 : 2;
      const ySplit = size.y < size.x ? 1 : 2;
      this.renderer.setViewport(
        0,
        0,
        size.x / xSplit - xMargin,
        size.y / ySplit - yMargin
      );
      this.renderer.setScissor(
        0,
        0,
        size.x / xSplit - xMargin,
        size.y / ySplit - yMargin
      );
      this.renderer.setScissorTest(true);
      this.camera.aspect =
        (size.x / xSplit - xMargin) / (size.y / ySplit - yMargin);
      this.camera.updateProjectionMatrix();
      this.renderer.render(this.scene, this.camera);
      this.renderer.setViewport(
        size.x - (size.x / xSplit - xMargin),
        size.y - (size.y / ySplit - yMargin),
        size.x / xSplit - xMargin,
        size.y / ySplit - yMargin
      );
      this.renderer.setScissor(
        size.x - (size.x / xSplit - xMargin),
        size.y - (size.y / ySplit - yMargin),
        size.x / xSplit - xMargin,
        size.y / ySplit - yMargin
      );
      this.renderer.setScissorTest(true);
      this.camera_reverse.position.copy(this.camera.position.clone().negate());
      this.camera_reverse.lookAt(this.camera.position);
      this.camera_reverse.aspect = this.camera.aspect;
      this.camera_reverse.updateProjectionMatrix();
      this.renderer.render(this.scene, this.camera_reverse);
    }
  },
  watch: {
    wireframe(val) {
      this.scene.memory.wireframe = val;
    },
    colorMode(val) {
      this.scene.memory.colorMode = val;
    }
  },
  destroyed() {
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.observer) this.observer.disconnect();
  }
};
</script>

<style>
canvas {
  width: 100%;
  height: 100%;
}
</style>
