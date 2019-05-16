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

const isProduction = process.env.NODE_ENV === "production";

export default {
  props: ["value"],
  data() {
    if (!this.value && !isProduction) this.$emit("input", localVersion);
    return {
      versions: isProduction ? [] : [localVersion]
    };
  },
  async mounted() {
    const files = await fetch(
      "https://cors-anywhere.herokuapp.com/https://api.bintray.com/packages/deltaevo/corewar/vm/files"
    ).then(res => res.json());
    this.versions = files
      .sort(({ created: a }, { created: b }) => Date.parse(b) - Date.parse(a))
      .map(({ version, path }) => ({
        name: version,
        url: `https://cors-anywhere.herokuapp.com/https://dl.bintray.com/deltaevo/corewar/${path}`
      }));
    if (!isProduction) this.versions.unshift(localVersion);
    if (!this.value) this.$emit("input", this.versions[0]);
  },
  components: {
    Multiselect
  }
};
</script>

<style></style>
