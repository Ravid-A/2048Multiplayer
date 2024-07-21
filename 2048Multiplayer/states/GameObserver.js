export const MoveDirection = {
  NONE: -1,
  MOVE_UP: 0,
  MOVE_DOWN: 1,
  MOVE_LEFT: 2,
  MOVE_RIGHT: 3,
};

const COOLDOWN = 200;

export default class Game {
  tiles = [];

  setState = null;

  score = 0;

  bestScore = 0;

  last_pressed = Date.now();

  constructor() {
    this.init();
  }

  setCallback(callback) {
    this.setState = callback;
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

    this.setState(this);
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

    this.setState(this);
  }

  setBestScoreFromLocalStorage() {
    const bestScore = localStorage.getItem("bestScore");
    if (bestScore) {
      this.bestScore = bestScore;

      this.setState(this);
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
    if (Date.now() - this.last_pressed < COOLDOWN) {
      return;
    }

    switch (direction) {
      case MoveDirection.MOVE_UP:
        this.last_pressed = Date.now();
        this.moveUp();
        break;
      case MoveDirection.MOVE_DOWN:
        this.last_pressed = Date.now();
        this.moveDown();
        break;
      case MoveDirection.MOVE_LEFT:
        this.last_pressed = Date.now();
        this.moveLeft();
        break;
      case MoveDirection.MOVE_RIGHT:
        this.last_pressed = Date.now();
        this.moveRight();
        break;
    }

    this.setState(this);
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

  moveUp() {
    let temp_tiles = this.tiles.slice();
    let score = this.score;

    let combined_tiles = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    let moves = 0;

    for (let col = 0; col < temp_tiles[0].length; col++) {
      for (let row = 1; row < temp_tiles.length; row++) {
        let value = temp_tiles[row][col];

        if (value == 0) {
          continue;
        }

        let prev_row = row - 1;

        if (prev_row >= 0) {
          if (temp_tiles[prev_row][col] == 0) {
            do {
              prev_row--;
            } while (prev_row >= 0 && temp_tiles[prev_row][col] == 0);

            if (prev_row >= 0) {
              if (
                temp_tiles[prev_row][col] == value &&
                !combined_tiles[prev_row][col]
              ) {
                //CallUp(row,col, prev_row);
                temp_tiles[prev_row][col] = value * 2;
                temp_tiles[row][col] = 0;
                combined_tiles[prev_row][col] = true;
                score += value * 2;
                moves++;
                continue;
              }
            }

            if (temp_tiles[prev_row + 1][col] == 0) {
              //CallUp(row, col, prev_row+1);
              temp_tiles[prev_row + 1][col] = value;
              temp_tiles[row][col] = 0;
              moves++;
              continue;
            }
          }

          if (
            temp_tiles[prev_row][col] == value &&
            !combined_tiles[prev_row][col]
          ) {
            //CallUp(row, col, prev_row);
            temp_tiles[prev_row][col] = value * 2;
            temp_tiles[row][col] = 0;
            score += value * 2;
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
        console.log(rand_col, temp_tiles[3][rand_col]);
      } while (temp_tiles[3][rand_col] != 0);

      temp_tiles[3][rand_col] = this.GetRandomValue;
    }

    this.tiles = temp_tiles;
    this.score = score;
  }

  moveDown() {
    let temp_tiles = this.tiles.slice();
    let score = this.score;

    let combined_tiles = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    let moves = 0;

    for (let col = 0; col < temp_tiles[0].length; col++) {
      for (let row = temp_tiles.length - 2; row >= 0; row--) {
        let value = temp_tiles[row][col];

        if (value == 0) {
          continue;
        }

        let next_row = row + 1;

        if (next_row < temp_tiles.length) {
          if (temp_tiles[next_row][col] == 0) {
            do {
              next_row++;
            } while (
              next_row < temp_tiles.length &&
              temp_tiles[next_row][col] == 0
            );

            if (next_row < temp_tiles.length) {
              if (
                temp_tiles[next_row][col] == value &&
                !combined_tiles[next_row][col]
              ) {
                temp_tiles[next_row][col] = value * 2;
                temp_tiles[row][col] = 0;
                score += value * 2;
                combined_tiles[next_row][col] = true;
                moves++;
                continue;
              }
            }

            if (temp_tiles[next_row - 1][col] == 0) {
              temp_tiles[next_row - 1][col] = value;
              temp_tiles[row][col] = 0;
              moves++;
              continue;
            }
          }

          if (
            temp_tiles[next_row][col] == value &&
            !combined_tiles[next_row][col]
          ) {
            temp_tiles[next_row][col] = value * 2;
            temp_tiles[row][col] = 0;
            score += value * 2;
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
      } while (temp_tiles[0][rand_col] != 0);

      temp_tiles[0][rand_col] = this.GetRandomValue;
    }

    this.tiles = temp_tiles;
    this.score = score;
  }

  moveLeft() {
    let temp_tiles = this.tiles.slice();
    let score = this.score;

    let combined_tiles = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    let moves = 0;

    for (let row = 0; row < temp_tiles.length; row++) {
      for (let col = 1; col < temp_tiles[0].length; col++) {
        let value = temp_tiles[row][col];

        if (value == 0) {
          continue;
        }

        let prev_col = col - 1;

        if (prev_col >= 0) {
          if (temp_tiles[row][prev_col] == 0) {
            do {
              prev_col--;
            } while (prev_col >= 0 && temp_tiles[row][prev_col] == 0);

            if (
              temp_tiles[row][prev_col] == value &&
              !combined_tiles[row][prev_col]
            ) {
              temp_tiles[row][prev_col] = value * 2;
              temp_tiles[row][col] = 0;
              score += value * 2;
              combined_tiles[row][prev_col] = true;
              moves++;
              continue;
            }

            if (temp_tiles[row][prev_col + 1] == 0) {
              temp_tiles[row][prev_col + 1] = value;
              temp_tiles[row][col] = 0;
              moves++;
              continue;
            }
          }

          if (
            temp_tiles[row][prev_col] == value &&
            !combined_tiles[row][prev_col]
          ) {
            temp_tiles[row][prev_col] = value * 2;
            temp_tiles[row][col] = 0;
            score += value * 2;
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
      } while (temp_tiles[rand_row][3] != 0);

      temp_tiles[rand_row][3] = this.GetRandomValue;
    }

    this.tiles = temp_tiles;
    this.score = score;
  }

  moveRight() {
    let temp_tiles = this.tiles.slice();
    let score = this.score;

    let combined_tiles = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    let moves = 0;

    for (let row = 0; row < temp_tiles.length; row++) {
      for (let col = temp_tiles[0].length - 2; col >= 0; col--) {
        let value = temp_tiles[row][col];

        if (value == 0) {
          continue;
        }

        let next_col = col + 1;

        if (next_col < temp_tiles[0].length) {
          if (temp_tiles[row][next_col] == 0) {
            do {
              next_col++;
            } while (
              next_col < temp_tiles[0].length &&
              temp_tiles[row][next_col] == 0
            );

            if (
              temp_tiles[row][next_col] == value &&
              !combined_tiles[row][next_col]
            ) {
              temp_tiles[row][next_col] = value * 2;
              temp_tiles[row][col] = 0;
              score += value * 2;
              combined_tiles[row][next_col] = true;
              moves++;
              continue;
            }

            if (temp_tiles[row][next_col - 1] == 0) {
              temp_tiles[row][next_col - 1] = value;
              temp_tiles[row][col] = 0;
              moves++;
              continue;
            }
          }

          if (
            temp_tiles[row][next_col] == value &&
            !combined_tiles[row][next_col]
          ) {
            temp_tiles[row][next_col] = value * 2;
            temp_tiles[row][col] = 0;
            score += value * 2;
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
      } while (temp_tiles[rand_row][0] != 0);

      temp_tiles[rand_row][0] = this.GetRandomValue;
    }

    this.tiles = temp_tiles;
    this.score = score;
    console.log(this.tiles);
  }
}
