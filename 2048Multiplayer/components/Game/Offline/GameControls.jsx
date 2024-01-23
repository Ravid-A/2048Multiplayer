import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { MoveDirection } from "../../../states/GameObserver";

import styles from "../../../styles/Game/Offline/GameControls.module.css";

const GameControls = ({ game }) => {
  const KeyToDirection = (key) => {
    switch (key) {
      case "ArrowUp":
        return MoveDirection.Up;
      case "ArrowDown":
        return MoveDirection.Down;
      case "ArrowLeft":
        return MoveDirection.Left;
      case "ArrowRight":
        return MoveDirection.Right;
    }
    return MoveDirection.None;
  };

  const CallMoveTile = (direction) => {
    game.moveTiles(direction);
  };

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      const direction = KeyToDirection(e.key);
      if (direction !== MoveDirection.None) {
        CallMoveTile(direction);
      }
    });
  }, []);

  const newGame = () => {
    game.start();
  };

  return (
    <div className={styles.game_controls}>
      <button onClick={newGame}>New Game</button>
    </div>
  );
};

export default observer(GameControls);
