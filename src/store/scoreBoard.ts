import { defineStore } from "pinia";
import { IScoreUser, IScoreboard } from "./models";
import { computed, ref } from "vue";

export const useScoreBoardStore = defineStore("scoreBoard", () => {
  const state = ref<IScoreboard>({
    scoreBoard: [],
  });

  const getScoreBoard = computed(() => {
    $initialLocalState();
    return state.value.scoreBoard.sort((t1, t2) => {
      if (t1.time > t2.time) {
        return 1;
      }
      if (t1.time < t2.time) {
        return -1;
      }
      return 0;
    });
  });

  const $initialLocalState = () => {
    if (localStorage.getItem("scoreboard")) {
      state.value.scoreBoard = JSON.parse(
        localStorage.getItem("scoreboard") || "{}"
      );
    }
  };

  const $setLocalState = (payload: Omit<IScoreUser, "id">) => {
    let id = state.value.scoreBoard.length;
    state.value.scoreBoard.push({ ...payload, id });
    localStorage.setItem("scoreboard", JSON.stringify(state.value.scoreBoard));
  };

  return { state, getScoreBoard, $initialLocalState, $setLocalState };
});
