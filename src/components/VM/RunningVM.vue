<template>
  <div class="running-vm">
    <arena :wireframe="wireframe" :colorMode="colorMode" class="arena"></arena>
    <section class="infos">
      <button @click="wireframe = !wireframe">Wireframe</button>
      <button @click="colorMode = !colorMode">Color Mode</button>
    </section>
  </div>
</template>

<script>
import Arena from "../Arena.vue";
export default {
  data() {
    return {
      wireframe: false,
      colorMode: false
    };
  },
  components: {
    Arena
  }
};
</script>

<style lang="stylus">
.running-vm {
	height: 100vh;
	overflow: hidden;
	display: flex;

	& > .arena {
		width: 80%;
	}
	& > .infos {
		width: 20%;
		background: red;
	}
}
</style>
