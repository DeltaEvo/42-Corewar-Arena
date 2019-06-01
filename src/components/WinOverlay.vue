<template>
  <div class="win-overlay">
    <div class="winner">
      <div class="container">
        <div
          class="petitTriangle"
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
    <img class="winnerPhoto" src="" alt="" />
    <div class="triangle"></div>
    <div class="podium">
      <div
        v-for="(player, i) in players.slice(1)"
        :key="player.name"
        class="first"
      >
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
        position: absolute;
        top: 0;
        text-shadow: 6px 0 0 black, -6px 0 0 black, 0 6px 0 black, 0 -6px 0 black, 4px 4px black, -4px -4px 0 black, 4px -4px 0 black, -4px 4px 0 black;
        font: small-caps bold 24px/1 sans-serif;
        left: 33px;
        color: white;
        font-size: 6rem;
      }
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
          position: absolute;
          bottom: -20px;
          left: 0;
          text-align: center;
          display: inline-block;
          font: small-caps bold 186px/1 sans-serif;
          width: 100%;
          background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke-color: black;
          -webkit-text-stroke-width: 5px;
        }
      }
      > .petitTriangle {
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
}
</style>
