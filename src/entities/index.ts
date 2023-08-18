export class Board {
  cell: number;
  cellX: number;
  cellY: number;
  bomb: number;
  constructor(cellX: number, cellY: number) {
    this.cell = cellX * cellY;
    this.cellX = cellX;
    this.cellY = cellY;
    this.bomb = Math.floor(this.cell / 6.4);
  }

  getBomb() {
    return this.bomb;
  }
  getCells() {
    return this.cell;
  }
}
