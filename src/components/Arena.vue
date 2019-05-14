<template>
  <canvas></canvas>
</template>

<script>
import { WebGLRenderer, PerspectiveCamera } from "three";
import Arena from "./Arena/Arena.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const FOV = 70;
const NEAR = 0.1;
const FAR = 1000;

export default {
  props: ["wireframe", "colorMode", "cycles", "cyclesPerSecond"],
  mounted() {
    const { clientWidth: width, clientHeight: height } = this.$el;

    this.renderer = new WebGLRenderer({
      canvas: this.$el,
      antialias: true
    });

    this.renderer.setSize(width, height);
    this.$el.style = "";

    this.camera = new PerspectiveCamera(FOV, width / height, NEAR, FAR);
    this.camera.position.z = 15;

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

    this.scene = window.scene = new Arena();
    this.scene.memory.wireframe = this.wireframe;
    this.scene.memory.colorMode = this.colorMode;

    this.cycle = 0;
    this.render();
  },
  computed: {
    cycleMs() {
      return 1000 / this.cyclesPerSecond;
    }
  },
  methods: {
    render(timestamp) {
      this.raf = requestAnimationFrame(this.render);
      timestamp = performance.now();
      for (
        let i = 0;
        (i < (timestamp - this.last_cycle) / this.cycleMs) | 0 &&
        this.cycles.length;
        i++
      ) {
        this.scene.run(this.cycles.shift());
        this.$emit("cycle");
      }
      this.$emit("processes", this.scene.processes.length);
      this.renderer.render(this.scene, this.camera);
      this.last_cycle = timestamp;
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
