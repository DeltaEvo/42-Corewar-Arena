<template>
  <div id="home">
    <Arena></Arena>
  </div>
</template>

<script>
// @ is an alias to /src
import Arena from "@/components/Arena.vue";

export default {
  name: "home",
  components: {
    Arena
  }
};
</script>

<style>
#home {
  height: calc(100vh - 81px);
}
</style>
