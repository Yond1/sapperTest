<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Board } from "../entities";
import { useScoreBoardStore } from "../store/scoreBoard";
import cellImage from "../assets/image/cell.png";
import cellOpenImage from "../assets/image/cellOpen.png";
import mineImage from "../assets/image/mine.png";
import one from "../assets/image/one.png";
import two from "../assets/image/two.png";
import three from "../assets/image/three.png";
import four from "../assets/image/four.png";
import five from "../assets/image/five.png";
import flagImage from "../assets/image/flag.png";
import questionImage from "../assets/image/question.png";
import activeMine from "../assets/image/activeMine.png";
import { useLevelStore } from "../store/level";

interface ICell {
  x: number;
  y: number;
  id: number;
  body: string | number;
  mineAround?: number;
  isMine: boolean;
  isOpen: boolean;
  status: ECellStatus;
}

enum EGameStatus {
  PLAY = "PLAY",
  GAME_OVER = "GAMEOVER",
  WAIT = "WAIT",
  WIN = "WIN",
}

enum ECellStatus {
  FLAG = "FLAG",
  QUESTION = "QUESTION",
  NEVER = "NEVER",
}

const matrixBoard = ref<Array<Array<ICell>> | undefined>();
const countOpenCell = ref<number>(0);
const gameStatus = ref<string>(EGameStatus.WAIT);
const clearCell = ref<number>(0);
const gameTime = ref<number>(0);
const divBoard = ref();
const userName = ref<string>("anonym");
const store = useScoreBoardStore();
const levelStore = useLevelStore();
const imageArr: Array<string> = [cellOpenImage, one, two, three, four, five];
let board = ref(new Board(9, 9));
const mineCount = ref(board.value.bomb);
//Create Matrix Board

const createMatrix = () => {
  let x = 0;
  let y = 0;
  matrixBoard.value = [[]];
  for (let i = 0; i < board.value.cell; i++) {
    if (i / (x + 1) === board.value.cellY) {
      x++;
      matrixBoard.value[x] = [];
    }
    matrixBoard.value[x].push({
      x: x,
      y: y,
      id: y,
      body: cellImage,
      isMine: false,
      isOpen: false,
      status: ECellStatus.NEVER,
    });
    y++;
    if (y === board.value.cellY) {
      y = 0;
      continue;
    }
  }
};

// createBomb

const createBomb = (id: number) => {
  for (let i = 0; i < mineCount.value; ) {
    let x = Math.floor(Math.random() * board.value.cellX);
    let y = Math.floor(Math.random() * board.value.cellY);
    if (
      matrixBoard.value![x][y].body === mineImage ||
      matrixBoard.value![x][y].id === id
    ) {
      continue;
    }
    matrixBoard.value![x][y] = {
      ...matrixBoard.value![x][y],
      body: mineImage,
      isMine: true,
    };
    i++;
  }
};

// mineAround

const mineAroundCounter = (x: number, y: number) => {
  let xStart = x > 0 ? x - 1 : x;
  let xEnd = x < board.value.cellX - 1 ? x + 1 : x;
  let yStart = y > 0 ? y - 1 : y;
  let yEnd = y < board.value.cellY - 1 ? y + 1 : y;
  let count = 0;
  for (let i = xStart; i <= xEnd; i++) {
    for (let j = yStart; j <= yEnd; j++) {
      if (matrixBoard.value![i][j].isMine && !(i == x && j == y)) {
        count++;
      }
    }
  }
  matrixBoard.value![x][y].mineAround = count;
};

const startAroundCounter = () => {
  for (let x = 0; x < board.value.cellX; x++) {
    for (let y = 0; y < board.value.cellY; y++) {
      mineAroundCounter(x, y);
    }
  }
};

//start timer

let timer: ReturnType<typeof setInterval>;

const startTimer = () => {
  timer = setInterval(() => {
    return gameTime.value++;
  }, 1000);
};

// openallmines

const openAllMines = (x: number, y: number) => {
  let boardx = board.value.cellX;
  let boardy = board.value.cellY;
  for (let i = 0; i < boardx; i++) {
    for (let j = 0; j < boardy; j++) {
      if (matrixBoard.value![i][j].isMine) {
        if (i === x && j === y) {
          matrixBoard.value![i][j].isOpen = true;
          matrixBoard.value![i][j].body = activeMine;
        } else {
          matrixBoard.value![i][j].isOpen = true;
          matrixBoard.value![i][j].body = mineImage;
        }
      }
    }
  }
};

// clickEvent
// opencells
const openCell = (x: number, y: number) => {
  if (gameStatus.value === EGameStatus.GAME_OVER) {
    return;
  }
  if (gameStatus.value === EGameStatus.WIN) {
    return;
  }
  if (
    matrixBoard.value![x][y].status === ECellStatus.FLAG ||
    matrixBoard.value![x][y].status === ECellStatus.QUESTION
  ) {
    return;
  }
  if (gameStatus.value === EGameStatus.WAIT) {
    createBomb(matrixBoard.value![x][y].id);
    startAroundCounter();
    startTimer();
  }
  gameStatus.value = EGameStatus.PLAY;
  if (matrixBoard.value![x][y].isMine) {
    gameStatus.value = EGameStatus.GAME_OVER;
    openAllMines(x, y);
    return;
  }
  if (matrixBoard.value![x][y].isOpen) {
    return;
  }
  countOpenCell.value++;
  if (countOpenCell.value === clearCell.value) {
    matrixBoard.value![x][y].isOpen = true;
    gameStatus.value = EGameStatus.WIN;
  }

  matrixBoard.value![x][y].isOpen = true;
  matrixBoard.value![x][y].body =
    imageArr[matrixBoard.value![x][y].mineAround!];
  if (matrixBoard.value![x][y].mineAround === 0) {
    let xStart = x > 0 ? x - 1 : x;
    let xEnd = x < board.value.cellX - 1 ? x + 1 : x;
    let yStart = y > 0 ? y - 1 : y;
    let yEnd = y < board.value.cellY - 1 ? y + 1 : y;
    for (let i = xStart; i <= xEnd; i++) {
      for (let j = yStart; j <= yEnd; j++) {
        openCell(i, j);
      }
    }
  }
};

// right click event
const markedCell = (e: MouseEvent, x: number, y: number) => {
  if (e.button === 2) {
    switch (matrixBoard.value![x][y].status) {
      case ECellStatus.NEVER:
        matrixBoard.value![x][y].status = ECellStatus.FLAG;
        break;
      case ECellStatus.FLAG:
        matrixBoard.value![x][y].status = ECellStatus.QUESTION;
        break;
      case ECellStatus.QUESTION:
        matrixBoard.value![x][y].status = ECellStatus.NEVER;
        break;
    }
  }
};

// restart game
const restart = () => {
  matrixBoard.value = undefined;
  gameStatus.value = EGameStatus.WAIT;
  countOpenCell.value = 0;
  start();
};
// disabled right click default behavior
const disabledDefaultContextMenu = () => {
  document.body.oncontextmenu = () => {
    return false;
  };
};
// start game
const start = () => {
  createMatrix();
  disabledDefaultContextMenu();
  gameStatus.value = EGameStatus.WAIT;
  clearCell.value = board.value.cell - board.value.bomb;
};

// render cell in html
const renderStatusCell = (cell: ICell) => {
  if (cell.isOpen) {
    if (cell.isMine) {
      return cell.body;
    }
    return cell.body;
  }
  if (cell.status === ECellStatus.FLAG) {
    return flagImage;
  }
  if (cell.status === ECellStatus.QUESTION) {
    return questionImage;
  }
  return cellImage;
};

// initialisation app

onMounted(() => {
  start();
});

// watcher game

watch(gameStatus, () => {
  if (gameStatus.value === EGameStatus.GAME_OVER) {
    gameTime.value = 0;
    clearInterval(timer);
  }
  if (gameStatus.value === EGameStatus.WIN) {
    userName.value = prompt("Введите ваше имя")!;
    store.$setLocalState({
      time: gameTime.value,
      username: userName.value || "anonym",
    });
    gameTime.value = 0;
    clearInterval(timer);
  }
});

watch(
  () => levelStore.level,
  () => {
    const [x, y] = levelStore.getLevel()!;
    board.value = new Board(x, y);
    mineCount.value = board.value.bomb;
    start();
  }
);
watch(
  () => levelStore.customLevel,
  () => {
    const [x, y] = levelStore.customLevel!;
    board.value = new Board(x, y);
    mineCount.value = board.value.bomb;
    start();
  }
);
</script>

<template>
  <div class="container">
    <div class="board-header">
      <div class="board-header-content">Количество мин: {{ mineCount }}</div>
      <div class="board-header-content">
        <span style="cursor: pointer" @click="restart"
          >{{
            gameStatus === EGameStatus.GAME_OVER
              ? "Вы проиграли"
              : gameStatus === EGameStatus.WIN
              ? "Вы выиграли"
              : "Начать заново"
          }}
        </span>
      </div>
      <div class="board-header-content">Время {{ gameTime }}</div>
    </div>
    <div ref="divBoard" class="board-wrapper">
      <div class="board" v-for="x in matrixBoard">
        <div
          @mousedown="(e) => !cell.isOpen && markedCell(e, cell.x, cell.y)"
          @click="openCell(cell.x, cell.y)"
          class="board-cell"
          :key="cell.id"
          :id="`${cell.id}`"
          v-for="cell in x"
        >
          <img class="board-cell-image" :src="`${renderStatusCell(cell)}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.board-wrapper {
  width: 100%;
}
.container {
  max-width: 70%;
}
.popup {
  width: 100%;
  height: 100%;
  background: white;
}
.board {
  width: 100%;
  display: flex;
  &-header {
    width: 100%;
    height: 80px;
    background: lightgrey;
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: space-between;
    padding: 10px 20px;
    align-items: center;
    &-content {
      width: 100%;
      height: 100%;
      border: 1px solid grey;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
    }
  }
  &-cell {
    width: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    &-image {
      width: 100%;
    }
  }
}

@media screen and (max-width: 600px) {
  .container {
    width: 100%;
    max-width: 100%;
  }
  .board-cell {
    width: 100%;
  }
  .board-header {
    padding: 5px 10px;
    gap: 8px;
    height: 50px;
    &-content {
      font-size: 12px;
      font-weight: 400;
    }
  }
}
</style>
