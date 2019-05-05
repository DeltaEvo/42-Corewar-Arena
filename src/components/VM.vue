<template>
  <running-VM v-if="vm.started" />
  <setup-VM :vm="vm" v-else />
</template>

<script>
import VM from "./VM/index.js";
import RunningVM from "./VM/RunningVM.vue";
import SetupVM from "./VM/SetupVM.vue";

export default {
  data() {
    return {
      vm: new VM()
    };
  },
  components: {
    RunningVM,
    SetupVM
  }
};
</script>

<style></style>
