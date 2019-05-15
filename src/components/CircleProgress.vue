<template>
  <div class="circle-progress">
    <svg :viewBox="`0 0 ${viewBoxSize * 2} ${viewBoxSize * 2}`">
      <circle
        class="back"
        fill="none"
        :cx="viewBoxSize"
        :cy="viewBoxSize"
        :r="radius"
        :stroke-width="strokeWidth"
      />
      <circle
        class="front"
        fill="none"
        :cx="viewBoxSize"
        :cy="viewBoxSize"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke-dasharray="strokeDashArray"
        :stroke-dashoffset="strokeDashOffset"
      />
    </svg>
    <div class="inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: [Number, String],
      default: 32
    },
    width: {
      type: [Number, String],
      default: 4
    },
    value: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    viewBoxSize() {
      return this.radius / (1 - +this.width / +this.size);
    },
    radius() {
      return 20;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    strokeDashArray() {
      return Math.round(this.circumference * 1000) / 1000;
    },

    strokeDashOffset() {
      return ((100 - this.value) / 100) * this.circumference + "px";
    },
    strokeWidth() {
      return (+this.width / +this.size) * this.viewBoxSize * 2;
    }
  }
};
</script>

<style lang="stylus">
@import "../stylus/theme.styl"

.circle-progress {
    position: relative;
    & > .inner {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    & > svg {
        & > .back {
            stroke: $color.secondary;
        }
        & > .front {
            stroke: #EF5350;
        }
    }
}
</style>
