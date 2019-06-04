<template>
  <div style="position: relative">
    <canvas ref="canvas"></canvas>
    <svg
      v-for="(heart, i) in hearts"
      :key="i"
      class="heart"
      :style="`top: ${heart.y}; left: ${heart.x}; fill: ${heart.color}`"
      viewBox="0 0 32 29.6"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
      />
    </svg>
  </div>
</template>

<script>
const COLORS = ["#33c47f", "#ff6950", "#4180db", "#a061d1"];
const CELL_SIZE = 32;

export default {
  props: ["cycles", "colorMode", "cyclesPerSecond"],
  data() {
    return {
      hearts: []
    };
  },
  mounted() {
    this.processes = [];

    this.canvas = this.$refs.canvas;

    this.context = this.canvas.getContext("2d");
    this.canvas.width = 64 * CELL_SIZE;
    this.canvas.height = 64 * CELL_SIZE;
    this.context.fillStyle = "black";
    this.context.strokeStyle = `#00ff41`;
    this.context.lineWidth = 0.5;
    this.context.font = `12px sans-serif`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.memory = Array.from({ length: 4096 }).map(() => ({
      color: "#000000",
      value: undefined,
      needUpdate: true
    }));
    for (let x = 0; x < 64; x++)
      for (let y = 0; y < 64; y++)
        this.context.strokeRect(
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
    this.tick();
  },
  watch: {
    colorMode() {
      this.memory.forEach(cell => (cell.needUpdate = true));
      this.render();
    }
  },
  computed: {
    cycleMs() {
      return 1000 / this.cyclesPerSecond;
    }
  },
  destroyed() {
    if (this.raf) cancelAnimationFrame(this.raf);
  },
  methods: {
    tick(timestamp) {
      this.raf = requestAnimationFrame(this.tick);
      if (!this.last_cycle) this.last_cycle = timestamp;
      if (this.cyclesPerSecond) {
        const cyclesToRun = Math.floor(
          (timestamp - this.last_cycle) / this.cycleMs
        );
        for (
          let i = 0;
          i < cyclesToRun &&
          this.cycles.length &&
          performance.now() - timestamp < 16;
          i++
        ) {
          this.run(this.cycles.shift());
          this.$emit("cycle");
          this.$emit("processes", this.processes.filter(e => e.live).length);
          this.last_cycle += this.cycleMs;
        }
        if (cyclesToRun) this.render();
      } else this.last_cycle = timestamp;
    },
    run(cycle) {
      for (const action of cycle) {
        if (action.action === "spawn") {
          const color =
            action.parent !== undefined
              ? this.processes[action.parent].color
              : COLORS[this.processes.length];
          this.processes.push({
            color,
            offset: action.offset,
            live: true
          });
          this.memory[action.offset].needUpdate = true;
        } else if (action.action === "write_memory") {
          const color = this.processes[action.process].color;
          for (let i = 0; i < action.memory.length; i++) {
            const idx = (action.from + i) % 4096;
            this.memory[idx].needUpdate = true;
            this.memory[idx].color = color;
            this.memory[idx].value = action.memory[i];
          }
        } else if (action.action === "adv") {
          const process = this.processes[action.process];
          this.memory[process.offset].needUpdate = true;
          process.offset = (process.offset + action.diff) % 4096;
          this.memory[process.offset].needUpdate = true;
        } else if (action.action == "cycle_to_die") {
          this.$emit("cycleDie", action.value);
        } else if (action.action == "live") {
          this.$emit("live", action.player);
          /*const process = this.processes[action.process];
          const heart = {
            x: ((process.offset % 64) / 64) * 100 + 0.75 + "%",
            y: (Math.floor(process.offset / 64) / 64) * 100 + 0.75 + "%",
            color: "red"
          };
          this.hearts.push(heart);
          setTimeout(
            () => this.hearts.splice(this.hearts.indexOf(heart), 1),
            1200
          );*/
        } else if (action.action == "jump") {
          const process = this.processes[action.process];
          this.memory[process.offset].needUpdate = true;
          process.offset = action.offset;
          this.memory[process.offset].needUpdate = true;
        } else if (action.action == "die") {
          this.memory[this.processes[action.process].offset].needUpdate = true;
          this.processes[action.process].live = false;
        } else if (action.action == "win") this.$emit("end");
        else console.log("Unhandled", action);
      }
    },
    render() {
      for (const [i, cell] of this.memory.entries()) {
        if (cell.needUpdate) {
          const x = i % 64;
          const y = Math.floor(i / 64);
          this.context.fillStyle = cell.color;
          this.context.fillRect(
            x * CELL_SIZE + 1,
            y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
          );
          if (!this.colorMode && cell.value !== undefined) {
            this.context.textAlign = "center";
            this.context.fillStyle = "white";
            this.context.fillText(
              `0x${cell.value.toString(16)}`,
              x * CELL_SIZE + CELL_SIZE / 2,
              y * CELL_SIZE + CELL_SIZE / 2 + 6
            );
          }
        }
      }
      for (const process of this.processes) {
        if (process.live && this.memory[process.offset].needUpdate) {
          const x = process.offset % 64;
          const y = Math.floor(process.offset / 64);
          if (this.memory[process.offset].color == "#000000") {
            const rgb = parseInt(process.color.slice(1), 16);
            const r = (rgb >> 16) & 0xff,
              g = (rgb >> 8) & 0xff,
              b = rgb & 0xff;
            this.context.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
          } else this.context.fillStyle = "rgba(255, 255, 255, 0.5)";
          this.context.fillRect(
            x * CELL_SIZE + 1,
            y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
          );
        }
      }
      this.memory.forEach(cell => (cell.needUpdate = false));
    }
  }
};
</script>

<style lang="stylus">
canvas {
  width: 100%;
  height: 100%;
}

.heart {
	position: absolute;
	display: inline-block;
	transform: translate(-50%, -50%);
	animation: breath 1s infinite;
    width: 1%;
}

@keyframes breath {
	0% {
		transform: translate(-50%, -50%) scale(1);
	}

	20% {
		transform: translate(-50%, -50%) scale(1.5);
	}

	40% {
		transform: translate(-50%, -50%) scale(1);
	}

	60% {
		transform: translate(-50%, -50%) scale(1.7);
	}

	100% {
		transform: translate(-50%, -50%) scale(1);
	}
}
</style>
