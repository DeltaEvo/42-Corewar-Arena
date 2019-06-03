<template>
  <div class="win-overlay">
    <img
      class="winnerPhoto"
      :src="`https://robohash.org/${players[0].name}.png`"
    />
    <div class="winner">
      <div class="container">
        <div
          class="triangle"
          :style="
            `border-color: transparent transparent transparent ${
              players[0].color
            }`
          "
        />
        <div class="laurier">
          <img src="/laurier.svg" />
          <span>1</span>
        </div>
      </div>
      <span class="winnerName">{{ players[0].name }}</span>
    </div>
    <div class="triangle"></div>
    <div class="podium">
      <div v-for="(player, i) in players.slice(1)" :key="i" class="first">
        <div class="second" :style="`background: ${player.color}`">
          <img :src="`https://robohash.org/${player.name}.png`" />
          <div class="corner">
            <span>{{ player.name }}</span>
          </div>
        </div>
        <span class="num">{{ i + 2 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["players"]
};
</script>

<style lang="stylus" scoped>
.win-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  perspective: 250px;
  perspective-origin: bottom right;
  overflow: hidden;
  pointer-events: none;

  @keyframes slideTop {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slideBottom {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }

  > .triangle {
    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    animation: slideUp 500ms;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 200px 0 0 130vw;
    border-color: transparent transparent transparent rgb(33, 29, 28);
  }
  > .podium {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: flex-start;
    width: 80vw;
    height: 300px;
    transform: rotateZ(-2deg) rotateY(7.5deg);
    transform-origin: left;

    @keyframes slidePodium {
      from {
        transform: rotateZ(-2deg) rotateY(7.5deg) translateY(100%);
      }
      to {
        transform: rotateZ(-2deg) rotateY(7.5deg) translateY(0);
      }
    }

    animation: slidePodium 500ms;

    > .first {
      position: relative;
      clip-path: polygon(70px 0, 0 33px, 0 100%, 100% 100%, 100% 0);
      width: 275px;
      height: 270px;
      padding: 10px;
      box-sizing: border-box;
      background: black;
      margin: 20px;

      > .second {
        clip-path: polygon(130px 0, 0 63px, 0 100%, 100% 100%, 100% 0);
        position: relative;

        > img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          display: block;
          filter: drop-shadow(-10px 10px 4px rgba(0,0,0,0.5));
        }

        > .corner {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          bottom: 0;
          right: 0;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 12px 100%);
          width: 90px;
          height: 30px;
          color: white;
          background: rgba(0, 0, 0, 0.3);
        }
      }
      .num {
        -webkit-text-fill-color: transparent;
        position: absolute;
        top: -2px;
        font: small-caps bold 120px/1 sans-serif;
        left: 20px;
        -webkit-text-stroke: 6px black;
        display: inline-block;
      }
    }

    > .first:nth-child(1) .num {
        background: linear-gradient(
          30deg,
          #dedede,
          #ffffff 16%,
          #dedede 21%,
          #ffffff 14%,
          #454545 27%,
          #dedede 36%,
          #ffffff 25%,
          #ffffff 30%,
          #dedede 72%,
          #ffffff 20%,
          #dedede 84%,
          #a1a1a1);
      -webkit-background-clip: text;
      }

      > .first:nth-child(2) .num {
        background: linear-gradient(
          30deg,
          #ca7345,
          #ffdeca 16%,
          #ca7345 21%,
          #ffdeca 24%,
          #a14521 27%,
          #ca7345 36%,
          #ffdeca 45%,
          #ffdeca 60%,
          #ca7345 72%,
          #ffdeca 80%,
          #ca7345 84%,
          #732100);
      -webkit-background-clip: text; ;
      }

      > .first:nth-child(3) .num {
      background: white;
      -webkit-background-clip: text;
      }
  }
  > .winner {
    @keyframes slideDown {
      from {
        transform: rotateY(2.5deg) translateY(-100%);
      }
      to {
        transform: rotateY(2.5deg) translateY(0);
      }
    }

    animation: slideDown 500ms;

    width: 40vw;
    height: 60vh;
    position: relative;
    display: flex;
    flex-direction: column;
    transform: rotateY(2.5deg);
    transform-origin: left;
    padding: 32px;
    > .container {
      display: flex;
      margin-bottom: 60px;
      margin-left: 20px;

      > .laurier {
        position: relative;
        margin-left: 10px;
        > img {
          width: 154px;
          height: 126px;
        }
        > span {
          background: linear-gradient(
          -40deg,
          #ffde45,
          #ffffff 16%,
          #ffde45 21%,
          #ffffff 24%,
          #452100 27%,
          #ffde45 36%,
          #ffffff 45%,
          #ffffff 30%,
          #ffde45 72%,
          #ffffff 40%,
          #ffde45 84%,
          #452100);
          position: absolute;
          bottom: -20px;
          left: 0;
          text-align: center;
          display: inline-block;
          font: small-caps bold 186px/1 sans-serif;
          width: 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 5px black;
        }
      }
      > .triangle {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 90px 0 0 100px;
          opacity: 0.4;
          margin-top: auto;
      }
    }
    > .winnerName {
        text-transform: uppercase;
        font: small-caps bold 160px/1 sans-serif;
        text-shadow: -10px 10px white;
    }
  }
  > .winnerPhoto {
    position: absolute;
    right: 0;
    bottom: 40px;
    width: 80%;
    height: 80%;
    object-fit: contain;
  }
}
</style>
