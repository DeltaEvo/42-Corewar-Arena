<template>
  <div class="running-vm">
    <arena
      :wireframe="wireframe"
      :colorMode="colorMode"
      class="arena"
      :cycles="vm.cycles"
      :champions="vm.champions"
      :cyclesPerSecond="cyclesPerSecond"
      @cycle="cycle++"
      @live="live"
      @cycleDie="cycleDie"
      @processes="value => (processes = value)"
    ></arena>
    <section class="infos">
      <div class="scores">
        <div
          v-for="(player, i) in vm.champions"
          :key="i"
          class="score-container"
          :style="
            `background-color: #${colors[i].toString(16)}; flex-grow: ${lives[
              i
            ] + 1};`
          "
        >
          <span class="name">{{ player.name }}</span>
          <img :src="`https://robohash.org/${player.name}.png`" />
          <span class="score">{{ lives[i] }}</span>
        </div>
        <div
          class="invalid"
          :style="`flex-grow: ${invalidLives + (invalidLives > 0)}`"
        >
          <span class="score">{{ invalidLives }}</span>
        </div>
      </div>
      <div class="bar">
        <circle-progress
          class="cycles"
          :value="(((cycle - lastCycleDie) % cycleToDie) / cycleToDie) * 100"
        >
          Cycle {{ cycle }}
        </circle-progress>
        <p>Speed {{ currentCyclesPerSecond }} cycles/s</p>
        <div class="cycles-per-second">
          <button v-show="cyclesPerSecond > 0" @click="cyclesPerSecond -= 10">
            -
          </button>
          <span>{{ cyclesPerSecond }} cycles/s</span>
          <button @click="cyclesPerSecond += 10">
            +
          </button>
        </div>
        <p>Processes {{ processes }}</p>
        <button @click="wireframe = !wireframe">Wireframe</button>
        <button @click="colorMode = !colorMode">Color Mode</button>
      </div>
    </section>
  </div>
</template>

<script>
import Arena from "../Arena.vue";
import CircleProgress from "../CircleProgress";
import { COLORS } from "../Arena/Memory";

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
      processes: 0,
      lives: [],
      invalidLives: 0,
      colors: COLORS
    };
  },
  mounted() {
    let last = this.cycle;
    setInterval(() => {
      this.currentCyclesPerSecond = this.cycle - last;
      last = this.cycle;
    }, 1000);
  },
  methods: {
    cycleDie(value) {
      console.log("CycleDie", value);
      this.lastCycleDie = this.cycle;
      this.cycleToDie = value;
      this.lives = this.vm.champions.map(() => 0);
      this.invalidLives = 0;
    },
    live(player) {
      if (player >= 1 && player <= this.lives.length) this.lives[player]++;
      else this.invalidLives++;
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
		width: 260px;
		background: $color.primary;
    color: white;
    display: flex;

    & > .scores {
      width: 60px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      text-align: center;

      .score-container, .invalid {
        transition: flex-grow 250ms;
        .score {
          font-weight: bold;
        }
      }

      .score-container {
        min-height: 150px;
        flex: 1;
        color: white;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        clip-path: polygon(0 0,100% 15px,100% 100%,0 calc(100% - 15px));
        margin: -15px 0;

        .name {
          font-weight: bold;
          font-size: 12px;
        }


        & > img {
          width: 60px;
          height: 60px;
          object-fit: cover;
        }
      }

      .invalid {
        min-height: 40px;
        background: black;
        display: flex;
        justify-content: center;
        flex-direction: column;
        font-weight: bold;
      }
    }
    & > .bar {
      width: 180px;
      padding: 10px;
      & > .cycles {
        margin: 15%;
      }
      & > .cycles-per-second {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
	}
}
</style>
