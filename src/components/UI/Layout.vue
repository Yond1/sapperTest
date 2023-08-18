<script setup lang="ts"></script>

<template>
  <div class="layout">
    <div class="layout-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100%;
  &-wrapper {
    position: relative;
    width: 100%;
    padding: 0 60px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media screen and (max-width: 600px) {
  .layout-wrapper {
    padding: 0 10px;
  }
}
</style>
