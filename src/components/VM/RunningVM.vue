<template>
  <div class="running-vm">
    <arena
      :wireframe="wireframe"
      :colorMode="colorMode"
      class="arena"
      :cycles="vm.cycles"
      :cyclesPerSecond="cyclesPerSecond"
      @cycle="cycle++"
      @processes="value => (processes = value)"
    ></arena>
    <section class="infos">
      <button @click="wireframe = !wireframe">Wireframe</button>
      <button @click="colorMode = !colorMode">Color Mode</button>
      <p>Cycle {{ cycle }}</p>
      <button @click="cyclesPerSecond += 10">+</button>
      <p>
        Cycles per second {{ currentCyclesPerSecond }}/{{ cyclesPerSecond }}
      </p>
      <button v-show="cyclesPerSecond > 0" @click="cyclesPerSecond -= 10">
        -
      </button>
      <p>Processes {{ processes }}</p>
    </section>
  </div>
</template>

<script>
import Arena from "../Arena.vue";
export default {
  props: ["vm"],
  data() {
    return {
      wireframe: false,
      colorMode: false,
      cycle: 0,
      currentCyclesPerSecond: 0,
      cyclesPerSecond: 400,
      processes: 0
    };
  },
  mounted() {
    let sampling = 1;
    let last = this.cycle;
    setInterval(() => {
      this.currentCyclesPerSecond = (this.cycle - last) * sampling;
      last = this.cycle;
    }, 1000 / sampling);
  },
  components: {
    Arena
  }
};
</script>

<style lang="stylus">
@import "../../stylus/theme.styl"

.running-vm {
	height: 100vh;
	overflow: hidden;
	display: flex;

	& > .arena {
		width: 80%;
	}
	& > .infos {
		width: 20%;
		background: $color.primary;
    color: white;
	}
}
</style>
