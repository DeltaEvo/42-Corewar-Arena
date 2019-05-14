<template>
  <div id="app">
    <VM />
  </div>
</template>
<script>
import VM from "./components/VM.vue";

export default {
  components: {
    VM
  }
};
</script>
<style lang="stylus">
@import  "./stylus/theme.styl"
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background: $color.background;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
