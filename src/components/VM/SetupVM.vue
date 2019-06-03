<template>
  <div class="vm-setup">
    <section class="selector">
      <div>
        <champion-selector
          :max="4"
          :champions="vm.champions"
          @load="load"
          @delete="item => vm.champions.splice(vm.champions.indexOf(item), 1)"
        />
      </div>
    </section>
    <div class="play">
      <ratio>
        <button @click="start">
          <icon class="icon" icon="play" />
        </button>
      </ratio>
    </div>
    <section class="panel">
      <div class="labeled-input">
        <label>VM Version:</label>
        <div style="width: 100%">
          <versions v-model="version" />
        </div>
      </div>
      <championship-selector @load="load" />
      <RTXSwitch
        class="rtx"
        :value="arena3d"
        @input="val => $emit('arena3d', val)"
      />
    </section>
  </div>
</template>

<script>
import ChampionSelector from "../ChampionSelector.vue";
import ChampionshipSelector from "../ChampionshipSelector.vue";
import Ratio from "../Ratio.vue";
import Versions from "../Versions.vue";
import RTXSwitch from "../RTXSwitch.vue";

export default {
  props: ["vm", "arena3d"],
  data() {
    return {
      version: null
    };
  },
  methods: {
    start() {
      if (this.version.url) this.vm.start(this.version.url);
      else alert("No version selected");
    },
    load(buffer) {
      if (this.vm.champions.length < 4) {
        try {
          this.vm.loadChampion(buffer);
        } catch (e) {
          alert(e);
        }
      }
    }
  },
  components: {
    ChampionSelector,
    ChampionshipSelector,
    Ratio,
    Versions,
    RTXSwitch
  }
};
</script>

<style lang="stylus">
@import "../../stylus/theme.styl"
.vm-setup {
  display: flex;
  height: 100vh;
  overflow: hidden;

  @media screen and (max-width: 640px) {
    flex-direction: column;
  }

  & > .selector {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: 640px) {
      width: 100%;
      height: 50%;
    }
    & > div {
      width: 100%;
      box-sizing: border-box;
      max-width: 100vh;
      padding: 10%;
    }
  }

  & > .play {
    display: flex;
    align-items: center;
    width: 4%;

    @media screen and (max-width: 640px) {
      flex-direction: column;
      width: 100%;
      height: 3.5vh;
    }
    button {
      cursor: pointer;
      display: block;
      width: 100%;
      height: 100%;
      border: 2px solid $color.primary;
      background: $color.background;
      border-radius: 50%;
      padding: 0;
      box-sizing: border-box;

      & > .icon {
        color: $color.primary;
        width: 100%;
        height: 100%;
        padding: 30%;
        box-sizing: border-box;
      }

      &:focus {
        outline: none;
      }
    }
  }

  & > .play > .box {
    position: absolute;
    width: 7.5%;

    @media screen and (max-width: 640px) {
      width: 7vh;
    }
  }

  & > .panel {
    width: 30%;
    background: $color.primary;
    box-sizing: border-box;
    color: white;
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 640px) {
      width: 100%;
      height: 50%;
    }
    .labeled-input {
      margin: 32px;
      margin-bottom: 0;
      display: flex;
      align-items: center;
      white-space: nowrap;

      & > * {
        padding: 0 8px;
      }
    }

    & > .championships {
      margin: 0 32px;
      height: 35%;

      @media screen and (max-width: 640px) {
        height: calc(80% - 80px);
      }
    }

    & > .rtx {
      margin: auto 0 15px auto;
    }
  }
}
</style>
