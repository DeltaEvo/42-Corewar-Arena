<template>
  <ratio class="champion">
    <span class="name">{{ value.name }}</span>
    <img class="avatar" :src="`https://robohash.org/${value.name}.png`" />
  </ratio>
</template>

<script>
import Ratio from "./Ratio";
export default {
  props: ["value"],
  components: {
    Ratio
  }
};
</script>

<style lang="stylus">
.champion {
	width: 20%;
	border-radius: 50%;
	border: 2px solid tomato;
	overflow: hidden;
	background: white;

	.name {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
	}

	.avatar {
		width: 100%;
		height: auto;
	}
}
</style>
