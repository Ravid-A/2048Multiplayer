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
    for (let col = 0; col < this.tiles[0].length; col++) {
      if (this.tiles[row][col] == 0) {
        return true;
      }
    }
    return false;
  }

  isColAvailable(col) {
    for (let row = 0; row < this.tiles.length; row++) {
      if (this.tiles[row][col] == 0) {
        return true;
      }
    }
    return false;
  }

  moveLeft() {
    let combined_tiles = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    let moves = 0;

    for (let col = 0; col < this.tiles[0].length; col++) {
      for (let row = 1; row < this.tiles.length; row++) {
        let value = this.tiles[row][col];

        if (value == 0) {
          continue;
        }

        let prev_row = row - 1;

        if (prev_row >= 0) {
          if (this.tiles[prev_row][col] == 0) {
            do {
              prev_row--;
            } while (prev_row >= 0 && this.tiles[prev_row][col] == 0);

            if (prev_row >= 0) {
              if (
                this.tiles[prev_row][col] == value &&
                !combined_tiles[prev_row][col]
              ) {
                this.tiles[prev_row][col] = value * 2;
                this.tiles[row][col] = 0;
                combined_tiles[prev_row][col] = true;
                this.score += value * 2;
                moves++;
                continue;
              }
            }

            if (this.tiles[prev_row + 1][col] == 0) {
              this.tiles[prev_row + 1][col] = value;
              this.tiles[row][col] = 0;
              moves++;
              continue;
            }
          }

          if (
            this.tiles[prev_row][col] == value &&
            !combined_tiles[prev_row][col]
          ) {
            this.tiles[prev_row][col] = value * 2;
            this.tiles[row][col] = 0;
            this.score += value * 2;
            combined_tiles[prev_row][col] = true;
            moves++;
            continue;
          }
        }
      }
    }

    if (moves && this.isRowAvailable(3)) {
      let rand_col;
      do {
        rand_col = this.GetRandomIndex;
      } while (this.tiles[3][rand_col] != 0);

      this.tiles[3][rand_col] = this.GetRandomValue;
    }
  }

  moveRight() {
    let combined_tiles = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    let moves = 0;

    for (let col = 0; col < this.tiles[0].length; col++) {
      for (let row = this.tiles.length - 2; row >= 0; row--) {
        let value = this.tiles[row][col];

        if (value == 0) {
          continue;
        }

        let next_row = row + 1;

        if (next_row < this.tiles.length) {
          if (this.tiles[next_row][col] == 0) {
            do {
              next_row++;
            } while (
              next_row < this.tiles.length &&
              this.tiles[next_row][col] == 0
            );

            if (next_row < this.tiles.length) {
              if (
                this.tiles[next_row][col] == value &&
                !combined_tiles[next_row][col]
              ) {
                this.tiles[next_row][col] = value * 2;
                this.tiles[row][col] = 0;
                this.score += value * 2;
                combined_tiles[next_row][col] = true;
                moves++;
                continue;
              }
            }

            if (this.tiles[next_row - 1][col] == 0) {
              this.tiles[next_row - 1][col] = value;
              this.tiles[row][col] = 0;
              moves++;
              continue;
            }
          }

          if (
            this.tiles[next_row][col] == value &&
            !combined_tiles[next_row][col]
          ) {
            this.tiles[next_row][col] = value * 2;
            this.tiles[row][col] = 0;
            this.score += value * 2;
            combined_tiles[next_row][col] = true;
            moves++;
            continue;
          }
        }
      }
    }

    if (moves && this.isRowAvailable(0)) {
      let rand_col;
      do {
        rand_col = this.GetRandomIndex;
      } while (this.tiles[0][rand_col] != 0);

      this.tiles[0][rand_col] = this.GetRandomValue;
    }
  }

  moveUp() {
    let combined_tiles = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    let moves = 0;

    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = 1; col < this.tiles[0].length; col++) {
        let value = this.tiles[row][col];

        if (value == 0) {
          continue;
        }

        let prev_col = col - 1;

        if (prev_col >= 0) {
          if (this.tiles[row][prev_col] == 0) {
            do {
              prev_col--;
            } while (prev_col >= 0 && this.tiles[row][prev_col] == 0);

            if (
              this.tiles[row][prev_col] == value &&
              !combined_tiles[row][prev_col]
            ) {
              this.tiles[row][prev_col] = value * 2;
              this.tiles[row][col] = 0;
              this.score += value * 2;
              combined_tiles[row][prev_col] = true;
              moves++;
              continue;
            }

            if (this.tiles[row][prev_col + 1] == 0) {
              this.tiles[row][prev_col + 1] = value;
              this.tiles[row][col] = 0;
              moves++;
              continue;
            }
          }

          if (
            this.tiles[row][prev_col] == value &&
            !combined_tiles[row][prev_col]
          ) {
            this.tiles[row][prev_col] = value * 2;
            this.tiles[row][col] = 0;
            this.score += value * 2;
            combined_tiles[row][prev_col] = true;
            moves++;
            continue;
          }
        }
      }
    }

    if (moves && this.isColAvailable(3)) {
      let rand_row;
      do {
        rand_row = this.GetRandomIndex;
      } while (this.tiles[rand_row][3] != 0);

      this.tiles[rand_row][0] = this.GetRandomValue;
    }
  }

  moveDown() {
    let combined_tiles = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    let moves = 0;

    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = this.tiles[0].length - 2; col >= 0; col--) {
        let value = this.tiles[row][col];

        if (value == 0) {
          continue;
        }

        let next_col = col + 1;

        if (next_col < this.tiles[0].length) {
          if (this.tiles[row][next_col] == 0) {
            do {
              next_col++;
            } while (
              next_col < this.tiles[0].length &&
              this.tiles[row][next_col] == 0
            );

            if (
              this.tiles[row][next_col] == value &&
              !combined_tiles[row][next_col]
            ) {
              this.tiles[row][next_col] = value * 2;
              this.tiles[row][col] = 0;
              this.score += value * 2;
              combined_tiles[row][next_col] = true;
              moves++;
              continue;
            }

            if (this.tiles[row][next_col - 1] == 0) {
              this.tiles[row][next_col - 1] = value;
              this.tiles[row][col] = 0;
              moves++;
              continue;
            }
          }

          if (
            this.tiles[row][next_col] == value &&
            !combined_tiles[row][next_col]
          ) {
            this.tiles[row][next_col] = value * 2;
            this.tiles[row][col] = 0;
            this.score += value * 2;
            combined_tiles[row][next_col] = true;
            moves++;
            continue;
          }
        }
      }
    }

    if (moves && this.isColAvailable(0)) {
      let rand_row;
      do {
        rand_row = this.GetRandomIndex;
      } while (this.tiles[rand_row][0] != 0);

      this.tiles[rand_row][0] = this.GetRandomValue;
    }
  }
}
