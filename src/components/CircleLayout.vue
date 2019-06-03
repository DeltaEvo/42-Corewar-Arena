<template>
  <div class="circle-layout">
    <div
      v-for="(item, i) in items"
      :key="i"
      :style="{
        transform: `translate(-50%, -50%)
				rotate(${(i * 360) / items.length}deg)
				translate(50%)
				rotate(-${(i * 360) / items.length}deg)`
      }"
    >
      <slot name="item" :item="item"></slot>
    </div>
    <div style="transform: translate(-50%, -50%); width: 25%">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["items"]
};
</script>

<style lang="stylus">
.circle-layout {
	position: relative;
	border-radius: 50%;
	border: solid 5px;
	box-sizing: border-box;

	& > div {
		display: flex;
		justify-content: center;
		position: absolute;
		width: 100%;
		top: 50%;
		left: 50%;
		transition: transform 250ms;
	}

	&:before {
		content: "";
		display: block;
		padding-top: 100%;
		pointer-events: none;
	}
}
</style>
