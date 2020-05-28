import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL
} from "./constants";

export class Model {
  constructor(displayCallback) {
    this.width = GAME_SIZE;
    this.height = GAME_SIZE;
    this.raf = null;
    this.displayCallback = displayCallback;
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );
    DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
      this.state[y][x] = CELL_STATES.ALIVE;
    });
    this.updated();
  }

  run(date = new Date().getTime()) {
    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      if (currentTime - date > RENDER_INTERVAL) {
        let state_copy = Array.from(new Array(this.height), () =>
          Array.from(new Array(this.width), () => CELL_STATES.NONE)
        );
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            const nbAlive = this.aliveNeighbours(i, j);
            state_copy[j][i] = this.state[j][i];
            // TODO implement Game of life logic
            if (
              (this.state[j][i] === CELL_STATES.DEAD ||
                this.state[j][i] === CELL_STATES.NONE) &&
              nbAlive === 3
            ) {
              state_copy[j][i] = CELL_STATES.ALIVE;
            }
            if (
              this.state[j][i] === CELL_STATES.ALIVE &&
              (nbAlive !== 2 && nbAlive !== 3)
            ) {
              state_copy[j][i] = CELL_STATES.DEAD;
            }
          }
        }
        this.state = state_copy;
        this.updated();
        this.run(currentTime);
      } else {
        this.run(date);
      }
    });
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  reset() {
    this.stop();
    this.init();
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.height &&
      this.state[y][x] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }
  aliveNeighbours(x, y) {
    let number = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (this.isCellAlive(i, j) && (i !== x || j !== y)) {
          number++;
        }
      }
    }
    return number;
  }

  updated() {
   // drawGame(this);
   this.displayCallback(this);
  }
}
