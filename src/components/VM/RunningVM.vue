<template>
  <div class="running-vm">
    <arena
      v-if="false"
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
    ></arena>
    <arena-2D
      v-else
      class="arena"
      :cycles="vm.cycles"
      :colorMode="colorMode"
      @cycle="cycle++"
      @live="live"
      @cycleDie="cycleDie"
      @processes="value => (processes = value)"
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
          <icon v-show="lastLive == i" icon="crown" />
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
        <div class="spacer"></div>
        <!--my-switch v-model="wireframe" label="Wireframe" /-->
        <my-switch v-model="colorMode" label="Stealth" />
        <!--my-switch v-model="doubleCamera" label="Double Camera" /-->
      </div>
    </section>
  </div>
</template>

<script>
import Arena from "../Arena.vue";
import Arena2D from "../Arena2D.vue";
import CircleProgress from "../CircleProgress";
import { COLORS } from "../Arena/Memory";
import Switch from "../Switch";

export default {
  props: ["vm"],
  data() {
    return {
      wireframe: false,
      colorMode: false,
      doubleCamera: false,
      cycle: 0,
      lastCycleDie: 0,
      cycleToDie: 1,
      currentCyclesPerSecond: 0,
      cyclesPerSecond: 50,
      processes: 0,
      lives: [],
      lastLive: -1,
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
      if (player >= 1 && player <= this.lives.length) {
        this.lives[player - 1]++;
        this.lastLive = player - 1;
      } else this.invalidLives++;
    }
  },
  computed: {
    progressDie() {
      return (
        ((this.cycle - this.lastCycleDie) % this.cycleToDie) / this.cycleToDie
      );
    }
  },
  components: {
    Arena,
    Arena2D,
    CircleProgress,
    MySwitch: Switch
  }
};
</script>

<style lang="stylus">
@import "../../stylus/theme.styl"

.running-vm {
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
    max-width: 100vh;

    @media screen and (max-width: 640px) {
      width: 100%;
      height: calc(100vh - 80px);
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

      & > .cycles {
        margin: 15%;
      }

      & > .cycles-per-second {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      & > .spacer {
        margin-top: auto;
      }
    }
	}
}
</style>
