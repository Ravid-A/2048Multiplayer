export default class CGame {
  tiles = [];

  score = 0;
  bestScore = 0;

  constructor() {
    this.init();
  }

  init() {
    this.tiles = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.bestScore = 0;
  }

  start() {
    this.init();
    this.addTile();
    this.addTile();
  }

  addTile() {
    let x, y;

    do {
      x = GetRandomIndex();
      y = GetRandomIndex();
    } while (this.tiles[x][y] != 0);
    this.tiles[x][y] = GetRandomValue();
  }

  GetRandomIndex() {
    return Math.floor(Math.random() * tiles.length);
  }

  GetRandomValue() {
    return 2 * (Math.floor(Math.random() * 2) + 1);
  }
}
