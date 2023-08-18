import { defineStore } from "pinia";
import { ref } from "vue";

export const useLevelStore = defineStore("level", () => {
  const level = ref(1);
  const customLevel = ref([0, 0]);

  const $updateLevel = (currentLevel: number): void => {
    level.value = currentLevel;
  };

  const $createCustomLevel = (x: number, y: number) => {
    customLevel.value = [x, y];
  };

  const getLevel = () => {
    if (level.value === 1) {
      return [9, 9];
    }
    if (level.value === 2) {
      return [16, 16];
    }
    if (level.value === 3) {
      return [16, 32];
    }
  };

  return { customLevel, level, $updateLevel, getLevel, $createCustomLevel };
});
