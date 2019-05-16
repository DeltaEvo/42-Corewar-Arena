<template>
  <div class="running-vm">
    <arena
      :wireframe="wireframe"
      :colorMode="colorMode"
      class="arena"
      :cycles="vm.cycles"
      :cyclesPerSecond="cyclesPerSecond"
      @cycle="cycle++"
      @cycleDie="cycleDie"
      @processes="value => (processes = value)"
    ></arena>
    <section class="infos">
      <circle-progress
        class="cycles"
        :value="(((cycle - lastCycleDie) % cycleToDie) / cycleToDie) * 100"
      >
        Cycle {{ cycle }}
      </circle-progress>
      <button @click="wireframe = !wireframe">Wireframe</button>
      <button @click="colorMode = !colorMode">Color Mode</button>
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
import CircleProgress from "../CircleProgress";

export default {
  props: ["vm"],
  data() {
    return {
      wireframe: false,
      colorMode: false,
      cycle: 0,
      lastCycleDie: 0,
      cycleToDie: 1,
      currentCyclesPerSecond: 0,
      cyclesPerSecond: 50,
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
  methods: {
    cycleDie(value) {
      console.log("CycleDie", value);
      this.lastCycleDie = this.cycle;
      this.cycleToDie = value;
    }
  },
  components: {
    Arena,
    CircleProgress
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
    width: calc(100% - 200px);
  }

	& > .infos {
		width: 200px;
		background: $color.primary;
    color: white;
    padding: 8px;

    & >.cycles {
      margin: 15%;
    }
	}
}
</style>
