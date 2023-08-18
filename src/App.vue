<script setup lang="ts">
import Header from "./components/Header.vue";
import Layout from "./components/UI/Layout.vue";
import "./styles/global.scss";
</script>

<template>
  <Layout>
    <Header />
    <router-view></router-view>
  </Layout>
</template>

<style scoped lang="scss"></style>
