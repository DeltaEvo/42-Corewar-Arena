<template>
  <div class="box">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.box {
  position: relative;
}
.box:before {
  display: block;
  content: "";
  padding-top: 100%;
  pointer-events: none;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
