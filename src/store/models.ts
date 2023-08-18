export interface IScoreboard {
  scoreBoard: IScoreUser[];
}

export interface IScoreUser {
  id: number;
  time: number;
  username: string;
}
