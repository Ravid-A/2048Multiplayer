import { makeObservable, observable, action, computed } from "mobx";

export const MoveDirection = {
  NONE: -1,
  MOVE_UP: 0,
  MOVE_DOWN: 1,
  MOVE_LEFT: 2,
  MOVE_RIGHT: 3,
};

export default class GameObserver {
  tiles = [];

  score = 0;

  bestScore = 0;

  constructor() {
    makeObservable(this, {
      tiles: observable,
      score: observable,
      bestScore: observable,
      start: action,
      setBestScore: action,
      setBestScoreFromLocalStorage: action,
      setScore: action,
      getScore: computed,
      getBestScore: computed,
      getBoard: computed,
      moveTiles: action,
    });
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
      x = this.GetRandomIndex;
      y = this.GetRandomIndex;
    } while (this.tiles[x][y] != 0);
    this.tiles[x][y] = this.GetRandomValue;
  }

  get GetRandomIndex() {
    return Math.floor(Math.random() * this.tiles.length);
  }

  get GetRandomValue() {
    return 2 * (Math.floor(Math.random() * 2) + 1);
  }

  setBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
  }

  setBestScoreFromLocalStorage() {
    const bestScore = localStorage.getItem("bestScore");
    if (bestScore) {
      this.bestScore = bestScore;
    }
  }

  setScore(value) {
    this.score += value;
  }

  get getScore() {
    return this.score;
  }

  get getBestScore() {
    return this.bestScore;
  }

  get getBoard() {
    return this.tiles;
  }

  moveTiles(direction) {
    switch (direction) {
      case MoveDirection.MOVE_UP:
        this.moveUp();
        break;
      case MoveDirection.MOVE_DOWN:
        this.moveDown();
        break;
      case MoveDirection.MOVE_LEFT:
        this.moveLeft();
        break;
      case MoveDirection.MOVE_RIGHT:
        this.moveRight();
        break;
    }
  }

  isRowAvailable(row) {
    for (let col = 0; col < tiles[0].length; col++) {
      if (tiles[row][col] == 0) {
        return true;
      }
    }
    return false;
  }

  moveUp() {
    let combined_tiles = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    let moves = 0;

    for (let col = 0; col < tiles[0].length; col++) {
      for (let row = 1; row < tiles.length; row++) {
        let value = tiles[row][col];

        if (value == 0) {
          continue;
        }

        let prev_row = row - 1;

        if (prev_row >= 0) {
          if (tiles[prev_row][col] == 0) {
            do {
              prev_row--;
            } while (prev_row >= 0 && tiles[prev_row][col] == 0);

            if (prev_row >= 0) {
              if (
                tiles[prev_row][col] == value &&
                !combined_tiles[prev_row][col]
              ) {
                //CallUp(row,col, prev_row);
                tiles[prev_row][col] = value * 2;
                tiles[row][col] = 0;
                combined_tiles[prev_row][col] = true;
                score += value * 2;
                moves++;
                continue;
              }
            }

            if (tiles[prev_row + 1][col] == 0) {
              //CallUp(row, col, prev_row+1);
              tiles[prev_row + 1][col] = value;
              tiles[row][col] = 0;
              moves++;
              continue;
            }
          }

          if (tiles[prev_row][col] == value && !combined_tiles[prev_row][col]) {
            //CallUp(row, col, prev_row);
            tiles[prev_row][col] = value * 2;
            tiles[row][col] = 0;
            score += value * 2;
            combined_tiles[prev_row][col] = true;
            moves++;
            continue;
          }
        }
      }
    }

    if (moves && isRowAvailable(3)) {
      let rand_col;
      do {
        rand_col = GetRandomIndex();
      } while (tiles[3][rand_col] != 0);

      tiles[3][rand_col] = GetRandomValue();
      //new_tile = [3, rand_col];
    }
  }
}
