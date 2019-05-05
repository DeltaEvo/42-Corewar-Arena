<template>
  <multiselect
    :value="value"
    @input="v => $emit('input', v)"
    :options="versions"
    label="name"
    :searchable="false"
    :close-on-select="false"
    :show-labels="false"
    :allow-empty="false"
    placeholder="Select version"
  ></multiselect>
</template>

<script>
import Multiselect from "vue-multiselect";

const localVersion = {
  name: "Local",
  url: "/vm.wasm"
};

export default {
  props: ["value"],
  data() {
    if (!this.value) this.$emit("input", localVersion);
    return {
      versions: [localVersion]
    };
  },
  async mounted() {
    const files = await fetch(
      "https://cors-anywhere.herokuapp.com/https://api.bintray.com/packages/deltaevo/corewar/vm/files"
    ).then(res => res.json());
    this.versions = files.map(({ version, path }) => ({
      name: version,
      url: `https://cors-anywhere.herokuapp.com/https://dl.bintray.com/deltaevo/corewar/${path}`
    }));
    this.versions.unshift(localVersion);
  },
  components: {
    Multiselect
  }
};
</script>

<style></style>
