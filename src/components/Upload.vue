<template>
  <label class="upload">
    <slot></slot>
    <input type="file" :accept="accept" @change="setFiles" />
  </label>
</template>

<script>
export default {
  props: ["accept"],
  name: "Upload",
  methods: {
    setFiles({ target }) {
      this.$emit("input", target.files);
      target.value = null;
    }
  }
};
</script>

<style lang="stylus">
.upload {
	display: inline-block;
	position: relative;
	width: 100%;
	height: 100%;
	cursor: pointer;

	input[type=file] {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		outline: none;
		cursor: inherit;
		display: block;
	}
}
</style>
