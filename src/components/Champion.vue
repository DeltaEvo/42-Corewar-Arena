<template>
  <ratio class="champion">
    <div class="name">
      <div>
        <span v-fitty>{{ value.name }}</span>
      </div>
    </div>
    <img class="avatar" :src="`https://robohash.org/${value.name}.png`" />
  </ratio>
</template>

<script>
import Ratio from "./Ratio";
import fitty from "fitty";
export default {
  props: ["value"],
  components: {
    Ratio
  },
  directives: {
    fitty: {
      inserted(el) {
        fitty(el, {
          minSize: 1
        });
      }
    }
  }
};
</script>

<style lang="stylus">
@import "../stylus/theme.styl"

.champion {
	width: 20%;
	border-radius: 50%;
	border: 2px solid $color.primary;
	overflow: hidden;
	background: white;

	.name {
		padding: 5px;
		box-sizing: border-box;
		font-weight: 600;
		width: 100%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		color: white;
		z-index: 2;
	}

	.avatar {
		width: 100%;
		height: auto;
		background: $color.secondary;
	}
}
</style>
