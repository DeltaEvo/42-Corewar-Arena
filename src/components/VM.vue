<template>
  <running-VM :vm="vm" v-if="vm.started" :arena3d="arena3d" />
  <setup-VM
    :vm="vm"
    :arena3d="arena3d"
    @arena3d="val => (arena3d = val)"
    v-else
  />
</template>

<script>
import VM from "./VM/index.js";
import RunningVM from "./VM/RunningVM.vue";
import SetupVM from "./VM/SetupVM.vue";

export default {
  data() {
    return {
      vm: new VM(),
      arena3d: true
    };
  },
  components: {
    RunningVM,
    SetupVM
  }
};
</script>

<style></style>
