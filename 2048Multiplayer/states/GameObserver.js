import { makeObservable, observable, action, computed } from "mobx";
import axios from "axios";

import GetAPIUrl from "../utilities/GetAPIUrl";

export const MoveDirection = {
  NONE: -1,
  MOVE_UP: 0,
  MOVE_DOWN: 1,
  MOVE_LEFT: 2,
  MOVE_RIGHT: 3,
};

export const GameOver = {
  CONTINUE: 0,
  WON: 1,
  LOST: 2,
};

const TimeIndex = {
  Index_16: 0,
  Index_32: 1,
  Index_64: 2,
  Index_128: 3,
  Index_256: 4,
  Index_512: 5,
  Index_1024: 6,
  Index_2048: 7,
};

const COOLDOWN = 200;

export default class Game {
  tiles = [];
  score = 0;
  bestScore = 0;
  last_pressed = Date.now();
  game_over = false;
  game_running = false;

  first_move = true;

  game_type = "";
  game_start_time = 0;
  game_end_time = 0;

  times = [0, 0, 0, 0, 0, 0, 0, 0];

  interval = null;

  constructor(game_type) {
    makeObservable(this, {
      tiles: observable,
      score: observable,
      bestScore: observable,
      game_running: observable,
      game_over: observable,
      times: observable,
      start: action,
      stop: action,
      setBestScore: action,
      setBestScoreFromDB: action,
      getBestTimes: action,
      getBestScore: action,
      setBestScoreValue: action,
      setScore: action,
      getScore: computed,
      getBoard: computed,
      moveTiles: action,
      hasMoves: computed,
    });

    let temp_obj = {
      tiles: [],
      score: 0,
      bestScore: 0,
    };

    this.init(temp_obj);

    this.score = temp_obj.score;
    this.bestScore = temp_obj.bestScore;
    this.times = temp_obj.times;
    this.tiles = temp_obj.tiles;
    this.game_type = game_type;
    this.first_move = true;
    this.game_running = false;
  }

  init(temp_obj) {
    temp_obj.tiles = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    temp_obj.times = [0, 0, 0, 0, 0, 0, 0, 0];

    temp_obj.score = 0;
    temp_obj.bestScore = 0;
  }

  start() {
    let temp_obj = {
      tiles: [],
      score: 0,
      bestScore: 0,
    };

    this.init(temp_obj);
    this.addTile(temp_obj);
    this.addTile(temp_obj);

    this.setBestScore();

    this.score = temp_obj.score;
    this.tiles = temp_obj.tiles;
    this.times = temp_obj.times;
    this.game_over = false;
    this.first_move = true;
    this.game_end_time = 0;
    this.game_start_time = 0;
  }

  stop() {
    this.game_running = false;
    this.game_end_time = Date.now();
    this.setBestScore();
  }

  getElapsedTime(time) {
    // format minutes:seconds.milliseconds
    time = this.game_start_time ? time - this.game_start_time : 0;
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    // miliscenods are 3 digits
    let milliseconds = Math.floor(time % 1000);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    milliseconds =
      milliseconds < 10
        ? `00${milliseconds}`
        : milliseconds < 100
        ? `0${milliseconds}`
        : milliseconds;

    return `${minutes}:${seconds}.${milliseconds}`;
  }

  getFormatedTime(time) {
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    let milliseconds = Math.floor(time % 1000);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    milliseconds =
      milliseconds < 10
        ? `00${milliseconds}`
        : milliseconds < 100
        ? `0${milliseconds}`
        : milliseconds;

    return `${minutes}:${seconds}.${milliseconds}`;
  }

  addTile(temp_obj) {
    let x, y;

    do {
      x = this.GetRandomIndex;
      y = this.GetRandomIndex;
    } while (temp_obj.tiles[x][y] != 0);
    temp_obj.tiles[x][y] = this.GetRandomValue;
  }

  get GetRandomIndex() {
    return Math.floor(Math.random() * this.tiles.length);
  }

  get GetRandomValue() {
    return 2 * (Math.floor(Math.random() * 2) + 1);
  }

  async setBestScore() {
    try {
      switch (this.game_type) {
        case "speedrun":
          await this.updateBestTimes();
          break;
        case "classic":
          await this.updateBestScore();
          await this.setBestScoreFromDB();
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateBestTimes() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const url = GetAPIUrl() + "/leaderboard";

    for (let i = 0; i < this.times.length; i++) {
      if (this.times[i] === 0) {
        continue;
      }

      try {
        const response = await axios.patch(
          url,
          {
            type: this.game_type,
            part: i,
            score: this.times[i],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            validateStatus: (status) => {
              return status < 500;
            },
          }
        );

        const data = await response.data;

        if (data.error) {
          continue;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async updateBestScore() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const url = GetAPIUrl() + "/leaderboard";
      const response = await axios.patch(
        url,
        {
          type: this.game_type,
          part: "0",
          score: this.score,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: (status) => {
            return status < 500;
          },
        }
      );

      const data = await response.data;

      if (data.error) {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async setBestScoreFromDB() {
    try {
      if (this.game_type === "classic") {
        this.setBestScoreValue(await this.getBestScore());
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getBestScore() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const url = GetAPIUrl() + "/leaderboard";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        type: this.game_type,
        part: "0",
      },
      validateStatus: (status) => {
        return status < 500;
      },
    });

    const data = await response.data;

    if (data.error) {
      return;
    }

    return data.score;
  }

  async getBestTimes() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const times = [0, 0, 0, 0, 0, 0, 0, 0];

    const url = GetAPIUrl() + "/leaderboard";

    for (let i = 0; i < this.times.length; i++) {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          type: this.game_type,
          part: i,
        },
        validateStatus: (status) => {
          return status < 500;
        },
      });

      const data = await response.data;

      if (data.error) {
        console.log(data.message);
        continue;
      }

      times[i] = data.score;
    }

    return times;
  }

  async getBestTimes() {
    const times = [0, 0, 0, 0, 0, 0, 0, 0];

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const url = GetAPIUrl() + "/leaderboard";

    for (let i = 0; i < this.times.length; i++) {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          type: this.game_type,
          part: i,
        },
        validateStatus: (status) => {
          return status < 500;
        },
      });

      const data = await response.data;

      if (data.error) {
        console.log(data.message);
        continue;
      }

      times[i] = data.score;
    }

    return times;
  }

  setScore(value) {
    this.score += value;
  }

  setBestScoreValue(value) {
    this.bestScore = value;
  }

  get getScore() {
    return this.score;
  }

  get getBoard() {
    return this.tiles;
  }

  moveTiles(direction) {
    if (this.game_over || (!this.first_move && !this.game_running)) {
      return;
    }

    if (this.first_move) {
      this.first_move = false;
      this.game_running = true;

      if (this.game_type === "speedrun") {
        this.game_start_time = Date.now();
      }
    }

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
                const new_value = value * 2;

                if (this.times[TimeIndex[`Index_${new_value}`]] === 0) {
                  this.times[TimeIndex[`Index_${new_value}`]] =
                    Date.now() - this.game_start_time;
                }

                temp_tiles[prev_row][col] = new_value;
                temp_tiles[row][col] = 0;
                combined_tiles[prev_row][col] = true;
                score += value * 2;
                moves++;
                continue;
              }
            }

            if (temp_tiles[prev_row + 1][col] == 0) {
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
            const new_value = value * 2;

            if (this.times[TimeIndex[`Index_${new_value}`]] === 0) {
              this.times[TimeIndex[`Index_${new_value}`]] =
                Date.now() - this.game_start_time;
            }

            temp_tiles[prev_row][col] = new_value;
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
      } while (temp_tiles[3][rand_col] != 0);

      temp_tiles[3][rand_col] = this.GetRandomValue;
    }

    this.tiles = temp_tiles;
    this.score = score;

    if (this.hasMoves != GameOver.CONTINUE) {
      this.gameOver();
    }
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
                const new_value = value * 2;

                if (this.times[TimeIndex[`Index_${new_value}`]] === 0) {
                  this.times[TimeIndex[`Index_${new_value}`]] =
                    Date.now() - this.game_start_time;
                }

                temp_tiles[next_row][col] = new_value;
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
            const new_value = value * 2;

            if (this.times[TimeIndex[`Index_${new_value}`]] === 0) {
              this.times[TimeIndex[`Index_${new_value}`]] =
                Date.now() - this.game_start_time;
            }

            temp_tiles[next_row][col] = new_value;
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

    if (this.hasMoves != GameOver.CONTINUE) {
      this.gameOver();
    }
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
              const new_value = value * 2;

              if (this.times[TimeIndex[`Index_${new_value}`]] === 0) {
                this.times[TimeIndex[`Index_${new_value}`]] =
                  Date.now() - this.game_start_time;
              }

              temp_tiles[row][prev_col] = new_value;
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
            const new_value = value * 2;

            if (this.times[TimeIndex[`Index_${new_value}`]] === 0) {
              this.times[TimeIndex[`Index_${new_value}`]] =
                Date.now() - this.game_start_time;
            }

            temp_tiles[row][prev_col] = new_value;
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

    if (this.hasMoves != GameOver.CONTINUE) {
      this.gameOver();
    }
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
              const new_value = value * 2;

              if (this.times[TimeIndex[`Index_${new_value}`]] === 0) {
                this.times[TimeIndex[`Index_${new_value}`]] =
                  Date.now() - this.game_start_time;
              }

              temp_tiles[row][next_col] = new_value;
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
            const new_value = value * 2;

            if (this.times[TimeIndex[`Index_${new_value}`]] === 0) {
              this.times[TimeIndex[`Index_${new_value}`]] =
                Date.now() - this.game_start_time;
            }

            temp_tiles[row][next_col] = new_value;
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

    if (this.hasMoves != GameOver.CONTINUE) {
      this.gameOver();
    }
  }

  get hasMoves() {
    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = 0; col < this.tiles[0].length; col++) {
        if (this.tiles[row][col] == 0) continue;
        if (this.tiles[row][col] == 2048) {
          return GameOver.WON;
        }
      }
    }

    // Check if any tiles can be combined
    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = 0; col < this.tiles[0].length; col++) {
        if (this.tiles[row][col] == 0) continue;
        if (row > 0 && this.tiles[row][col] == this.tiles[row - 1][col])
          return GameOver.CONTINUE;
        if (
          row < this.tiles.length - 1 &&
          this.tiles[row][col] == this.tiles[row + 1][col]
        )
          return GameOver.CONTINUE;
        if (col > 0 && this.tiles[row][col] == this.tiles[row][col - 1])
          return GameOver.CONTINUE;
        if (
          col < this.tiles[0].length - 1 &&
          this.tiles[row][col] == this.tiles[row][col + 1]
        )
          return GameOver.CONTINUE;
      }
    }

    // Check if any tiles can be moved
    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = 0; col < this.tiles[0].length; col++) {
        if (this.tiles[row][col] == 0) return GameOver.CONTINUE;
      }
    }

    // No moves available
    return GameOver.LOST;
  }

  gameOver() {
    this.game_running = false;
    this.game_over = true;
    this.game_end_time = Date.now();

    this.setBestScore();
  }
}
