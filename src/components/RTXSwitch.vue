<template>
  <label>
    <input type="checkbox" v-model="model" />
    <span>RTX</span>
  </label>
</template>

<script>
export default {
  props: ["value"],
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
label {
  position: relative;
  display: inline-block;
  cursor: pointer;
  background: black;
  width: 100px;
  height: 50px;
  clip-path: polygon(10px 0, 0 100%, 100% 100%, 100% 0);
  text-align: left;

  & > span {
    display: inline-block;
    text-align: center;
    width: 85px;
    padding: 5px 0;
    box-sizing: border-box;
    font-size: 20px;
    line-height: 20px;
    height: 50px;
    clip-path: polygon(10px 0, 0 100%, calc(100% - 10px) 100%, 100% 0);
    background: black;
    font-weight: 500;

    &::after {
      content: "\AOFF";
      white-space: pre;
      font-weight: 900;
    }
  }

  & > input:checked + span {
    background: #70A602;
    &::after {
      content: "\AON"
    }
  }

  &::after {
    display: block;
    position: absolute;
    top: 0;
    right: 15px;
    content: "";
    clip-path: polygon(10px 0, 0 100%, calc(100% - 10px) 100%, 100% 0);
    width: 15px;
    height: 100%;
    background: #70A602;
  }
}


input[type='checkbox'] {
    display: none;
}
</style>
