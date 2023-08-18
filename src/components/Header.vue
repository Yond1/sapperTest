<script setup lang="ts">
import Settings from "./Settings.vue";
</script>

<template>
  <header class="header">
    <nav class="header-left">
      <router-link to="/">Home</router-link>
      <router-link to="/scoreboard">Scoreboard</router-link>
    </nav>
    <div class="header-right">
      <Settings />
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 60px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-left {
    display: flex;
    gap: 40px;
  }
}
</style>
