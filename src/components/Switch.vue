<template>
  <label>
    <input type="checkbox" v-model="model" />
    <span>{{ label }}</span>
  </label>
</template>

<script>
export default {
  props: ["label", "value"],
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
@import "../stylus/theme.styl"

label {
    display: block;
    cursor: pointer;
    padding: 8px 0;
    & > span {
        position: relative;
        padding-left: 3em;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 1px;
            width: 40px;
            height: 20px;
            border-radius: 1.2em;
            background: $color.secondary;
            transition: background-color 200ms;
        }
        &::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            top: 3px;
            left: 2px;
            border-radius: 50%;
            background: $color.primary;
            transition: left 200ms;
        }
    }
    & > input:checked + span {
        &::before {
            background: $color.active;
        }

        &::after {
            left: 22px;
        }
    }
}


input[type='checkbox'] {
    display: none;
}
</style>
