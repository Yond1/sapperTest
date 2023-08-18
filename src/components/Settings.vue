<script setup lang="ts">
import { ref, watch } from "vue";
import { useLevelStore } from "../store/level";
import settingImage from "../assets/image/settings.png";

const currentLevel = ref(1);
const showModal = ref({
  openLevels: false,
  openCustomLevels: false,
});
const inputValue = ref({
  x: 0,
  y: 0,
});

const handleShowModal = () => {
  showModal.value.openLevels = !showModal.value.openLevels;
};

const handleShowCustomModal = () => {
  showModal.value.openCustomLevels = !showModal.value.openCustomLevels;
};

const store = useLevelStore();

const pickLevel = (level: number) => {
  switch (level) {
    case 1:
      currentLevel.value = 1;
      showModal.value.openLevels = false;
      break;
    case 2:
      currentLevel.value = 2;
      showModal.value.openLevels = false;
      break;
    case 3:
      currentLevel.value = 3;
      showModal.value.openLevels = false;
      break;
    case 4:
      currentLevel.value = 4;
      handleShowCustomModal();
      break;
  }
};

const createBoard = () => {
  if (inputValue.value.x > 4 && inputValue.value.y > 4) {
    store.$createCustomLevel(inputValue.value.x, inputValue.value.y);
    showModal.value.openCustomLevels = false;
  }
};

const handleOutside = () => {
  showModal.value.openLevels = false;
  showModal.value.openCustomLevels = false;
};

watch(currentLevel, () => {
  if (currentLevel.value === 4) {
    return;
  }
  showModal.value.openCustomLevels = false;
  store.$updateLevel(currentLevel.value);
});

watch(showModal.value, () => {
  if (
    showModal.value.openLevels === true ||
    showModal.value.openCustomLevels === true
  ) {
    console.log("open");
    return document.body.addEventListener("click", handleOutside);
  }
  document.body.removeEventListener("click", handleOutside);
});
</script>

<template>
  <div @click.stop @click="handleShowModal" class="header-settings">
    <div
      @click.stop
      v-show="showModal.openLevels"
      class="header-settings-popup"
    >
      <div
        v-show="showModal.openCustomLevels"
        class="header-settings-popup-custom-level"
      >
        <label for="inputCustomX">Количество Столбцов:</label>
        <input v-model="inputValue.x" id="inputCustomX" type="number" />
        <label for="inputCustomY">Количество Колонок:</label>
        <input v-model="inputValue.y" id="inputCustomY" type="number" />
        <button @click="createBoard">Create Board</button>
      </div>
      <span @click="pickLevel(1)">Level one</span>
      <span @click="pickLevel(2)">Level two</span>
      <span @click="pickLevel(3)">Level three</span>
      <span @click="pickLevel(4)">custom level</span>
    </div>
    <img :src="settingImage" alt="" />
  </div>
</template>

<style scoped lang="scss">
.header-settings {
  position: relative;
  height: 100%;
  width: 40px;
  img {
    width: 100%;
    cursor: pointer;
  }
  &-popup {
    position: absolute;
    width: 100px;
    background: white;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    &-custom-level {
      position: absolute;
      left: -200px;
      width: 200px;
      height: 200px;
      background: white;
      border: 1px solid black;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      input {
        width: 50%;
        height: 15%;
      }
    }
    span {
      cursor: pointer;
    }
  }
}
</style>
