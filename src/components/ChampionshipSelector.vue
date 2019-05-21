<template>
  <div class="championships">
    <ul class="tabs">
      <li
        v-for="(championship, i) in championships"
        :key="i"
        :class="{ active: selected === championship }"
        @click="selected = championship"
      >
        {{ championship.name }}
      </li>
    </ul>
    <div class="champions" v-if="selected">
      <champion
        v-for="champ in selected.champs"
        :value="champ"
        :key="champ.name"
        @click.native="selectChampion(`${selected.name}/${champ.name}.cor`)"
      />
      <div class="champion-filler" v-for="i in 10" :key="i" />
    </div>
  </div>
</template>

<script>
import Champion from "./Champion";

export default {
  data() {
    return {
      selected: null,
      championships: []
    };
  },
  async mounted() {
    const folders = await fetch(
      "https://api.github.com/repos/Tkesray/corewar/contents/?ref=championship"
    ).then(res => res.json());
    this.championships = await Promise.all(
      folders.map(async ({ name }) => ({
        name,
        champs: await fetch(
          `https://api.github.com/repos/Tkesray/corewar/contents/${name}?ref=championship`
        )
          .then(res => res.json())
          .then(folders =>
            folders.map(({ name }) => ({ name: name.slice(0, -4) }))
          )
      }))
    );
    this.selected = this.championships[0];
  },
  methods: {
    selectChampion(path) {
      fetch(
        `https://raw.githubusercontent.com/Tkesray/corewar/championship/${path}`
      )
        .then(res => res.arrayBuffer())
        .then(buffer => this.$emit("load", buffer));
    }
  },
  components: {
    Champion
  }
};
</script>

<style lang="stylus">
@import "../stylus/theme.styl"

.championships {
    .tabs {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: space-around;
        margin: 0;
        margin-top: 16px;
        height: 22px;
        padding: 0;

        & > li {
            position: relative;
            width: 100%;
            list-style: none;
            cursor: pointer;
            color: black;
            text-align: center;
            color: white;

            &::after {
                content: '';
                position: absolute;
                left: 50%;
                width: 100%;
                height: 2px;
                background-color: $color.secondary;
                transform-origin: center;
                transform: translateX(-50%) scaleX(0);
                transition: transform 250ms ease;
            }

            &::after {
                bottom: 0;
            }
        }

        & > li.active::after {
            transform: translateX(-50%) scaleX(1);
        }
    }
    .champions {
        max-height: calc(100% - 38px);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        overflow-y: auto;

        & > .champion {
            background: none !important;
            border-radius: 0;
            margin: 2px;
            cursor: pointer;
            width: 75px;
        }

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-thumb {
            background: $color.secondary;
        }

        & > .champion-filler {
            width: 75px + 4px;
            border: 2px solid transparent;
        }
    }
}
</style>
