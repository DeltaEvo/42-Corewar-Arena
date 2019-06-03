<template>
  <div class="running-vm">
    <arena
      v-if="arena3d"
      :wireframe="wireframe"
      :colorMode="colorMode"
      class="arena"
      :cycles="vm.cycles"
      :champions="vm.champions"
      :cyclesPerSecond="cyclesPerSecond"
      :doubleCamera="doubleCamera"
      :progressDie="progressDie"
      @cycle="cycle++"
      @live="live"
      @cycleDie="cycleDie"
      @processes="value => (processes = value)"
      @end="ended = true"
    ></arena>
    <arena-2D
      v-else
      class="arena arena2d"
      :cycles="vm.cycles"
      :colorMode="colorMode"
      @cycle="cycle++"
      @live="live"
      @cycleDie="cycleDie"
      @processes="value => (processes = value)"
      @end="ended = true"
    ></arena-2D>
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
          <icon v-show="lastLives[0].i === i" icon="crown" />
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
        <circle-progress class="cycles" :value="progressDie * 100">
          Cycle {{ cycle }}
        </circle-progress>
        <p>Cycles to die: {{ cycleToDie }}</p>
        <p>Speed: {{ currentCyclesPerSecond }} cycles/s</p>
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
        <div class="spacer"></div>
        <my-switch v-if="arena3d" v-model="wireframe" label="Wireframe" />
        <my-switch v-model="colorMode" label="Stealth" />
        <my-switch
          v-if="arena3d"
          v-model="doubleCamera"
          label="Double Camera"
        />
      </div>
    </section>
    <win-overlay v-if="ended" :players="lastLives" />
  </div>
</template>

<script>
import Arena from "../Arena.vue";
import Arena2D from "../Arena2D.vue";
import CircleProgress from "../CircleProgress";
import { COLORS } from "../Arena/Memory";
import Switch from "../Switch";
import WinOverlay from "../WinOverlay";

export default {
  props: ["vm", "arena3d"],
  data() {
    return {
      wireframe: false,
      colorMode: false,
      doubleCamera: false,
      ended: false,
      cycle: 0,
      lastCycleDie: 0,
      cycleToDie: 0,
      currentCyclesPerSecond: 0,
      cyclesPerSecond: 50,
      processes: 0,
      lives: [],
      lastLives: this.vm.champions.map(({ name }, i) => ({
        name,
        i,
        color: `#${COLORS[i].toString(16)}`
      })),
      invalidLives: 0,
      colors: COLORS
    };
  },
  watch: {
    cycle(val) {
      if ((val - this.lastCycleDie) % this.cycleToDie === 0) {
        this.lives = this.vm.champions.map(() => 0);
        this.invalidLives = 0;
      }
    }
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
      this.lastCycleDie = this.cycle;
      this.cycleToDie = value;
      this.lives = this.vm.champions.map(() => 0);
      this.invalidLives = 0;
    },
    live(player) {
      if (player >= 1 && player <= this.lives.length) {
        this.lives[player - 1]++;
        const currentIdx = this.lastLives.findIndex(
          ({ name }) => name === this.vm.champions[player - 1].name
        );
        const [toMove] = this.lastLives.splice(currentIdx, 1);
        this.lastLives.unshift(toMove);
      } else this.invalidLives++;
    }
  },
  computed: {
    progressDie() {
      if (this.cycleToDie === 0) return 1;
      else
        return (
          ((this.cycle - this.lastCycleDie) % this.cycleToDie) / this.cycleToDie
        );
    }
  },
  components: {
    Arena,
    Arena2D,
    CircleProgress,
    WinOverlay,
    MySwitch: Switch
  }
};
</script>

<style lang="stylus">
@import "../../stylus/theme.styl"

.running-vm {
	background: $color.primary;
	height: 100vh;
	overflow: hidden;
	display: flex;

  @media screen and (max-width: 640px) {
    flex-direction: column;
    overflow-y: scroll;
    height: inherit;
  }

  & > .arena {
    width: calc(100% - 260px);

    &.arena2d {
      max-width: 100vh;
      margin: auto;
    }

    @media screen and (max-width: 640px) {
      width: 100%;
      height: calc(100vh - 80px);
      &.arena2d {
        max-height: 100vw;
      }
    }
  }

	& > .infos {
		width: 260px;
		background: $color.primary;
    color: white;
    display: flex;

    @media screen and (max-width: 640px) {
      width: 100%;
      flex-direction: column;
    }

    & > .scores {
      width: 60px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      text-align: center;

      @media screen and (max-width: 640px) {
        width: inherit;
        min-height: 80px;
        flex-direction: row;
      }


      .score-container {
        min-height: 150px;
        flex: 1;
        color: white;
        height: 100%;

        .name {
          font-weight: bold;
          font-size: 12px;
        }

        & > img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          @media screen and (max-width: 640px) {
            width: 25px;
            height: 25px;
          }
        }
      }

      .invalid {
        min-height: 40px;
        background: black;
        font-weight: bold;
      }

      .score-container, .invalid {
        clip-path: polygon(0 0,100% 15px,100% 100%,0 calc(100% - 15px));
        margin: -15px 0;
        transition: flex-grow 250ms;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        @media screen and (max-width: 640px) {
          clip-path: polygon(0 0, 15px 100%,100% 100%, calc(100% - 15px) 0);
          margin: 0 -15px;
          height: 100%;
          height: 80px;
          min-height: inherit;
          min-width: 100px;
        }

        .score {
          font-weight: bold;
        }
      }
    }
    & > .bar {
      width: 180px;
      padding: 10px;
      flex-direction: column;
      display: flex;
      box-sizing: border-box;

      @media screen and (max-width: 640px) {
        width: inherit;
      }

      > p {
        margin: 4px;
      }

      > .cycles {
        margin: 15%;
      }

      > .cycles-per-second {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      > .spacer {
        margin-top: auto;
      }
    }
	}
}
</style>
