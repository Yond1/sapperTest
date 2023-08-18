<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useScoreBoardStore } from "../../store/scoreBoard";

const { getScoreBoard } = storeToRefs(useScoreBoardStore());
</script>

<template>
  <div class="scoreboard">
    <div v-if="getScoreBoard.length < 1">Нет результатов</div>
    <div v-for="(userScore, index) in getScoreBoard" :key="userScore.id">
      Место {{ index + 1 }}, Имя пользователя: {{ userScore.username }}, Время:
      {{ userScore.time }}
      секунды
    </div>
  </div>
</template>

<style scoped lang="scss">
.scoreboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
