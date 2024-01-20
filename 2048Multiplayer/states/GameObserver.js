import { makeObservable, observable, action, computed } from "mobx";

export default class GameObserver {
  tiles = [];

  score = 0;

  bestScore = 0;

  constructor() {
    makeObservable(this, {
      tiles: observable,
      score: observable,
      bestScore: observable,
      init: action,
      start: action,
      addTile: action,
      setBestScore: action,
      setBestScoreFromLocalStorage: action,
      setScore: action,
      GetRandomIndex: computed,
      GetRandomValue: computed,
      getScore: computed,
      getBestScore: computed,
      getBoard: computed,
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
}
