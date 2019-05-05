<template>
  <circle-layout :items="champions" class="circle">
    <champion slot="item" slot-scope="{ item }" :value="item"></champion>
    <ratio class="add" v-if="champions.length < max">
      <upload accept=".cor,.cro" @input="add">
        <icon class="icon" icon="upload" />
      </upload>
    </ratio>
  </circle-layout>
</template>

<script>
import CircleLayout from "./CircleLayout";
import Champion from "./Champion";
import Ratio from "./Ratio";
import Upload from "./Upload";

export default {
  props: ["champions", "max"],
  methods: {
    add(files) {
      Array.from(files).forEach(async file => {
        const arrayBuffer = await new Response(file).arrayBuffer();
        this.$emit("load", arrayBuffer);
      });
    }
  },
  components: {
    CircleLayout,
    Champion,
    Ratio,
    Upload
  }
};
</script>

<style lang="stylus">
.circle {
	width: 100%;
	.add {
		width: 25%;
		border-radius: 50%;
		border: 2px solid tomato;

		.icon {
			box-sizing: border-box;
			padding: 20%;
			width: 100%;
			height: 100%;
			color: tomato;
		}
	}
}
</style>
