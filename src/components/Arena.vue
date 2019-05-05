<template>
  <canvas></canvas>
</template>

<script>
import { WebGLRenderer, PerspectiveCamera } from "three";
import Arena from "./Arena/Arena.js";
import OrbitControls from "./Arena/OrbitControls";

const FOV = 70;
const NEAR = 0.1;
const FAR = 1000;

export default {
  props: ["wireframe", "colorMode"],
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

    new OrbitControls(this.camera, this.$el);

    this.scene = window.scene = new Arena();
    this.scene.memory.wireframe = this.wireframe;
    this.scene.memory.colorMode = this.colorMode;

    this.render();
  },
  methods: {
    render() {
      this.raf = requestAnimationFrame(this.render);
      this.renderer.render(this.scene, this.camera);
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
