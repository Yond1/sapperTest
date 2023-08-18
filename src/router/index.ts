import { createRouter, createWebHistory } from "vue-router";
import MainView from "../views/MainView/MainView.vue";
import ScoreBoardView from "../views/ScoreboardView/ScoreBoardView.vue";

const routes = [
  { path: "/", component: MainView },
  { path: "/scoreboard", component: ScoreBoardView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
