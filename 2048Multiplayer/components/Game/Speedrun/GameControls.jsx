import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { MoveDirection } from "../../../states/GameObserver";
import styles from "../../../styles/Game/Speedrun/GameControls.module.css";

const GameControls = ({ game, setPopup, popup }) => {
  const KeyToDirection = (key) => {
    switch (key) {
      case "ArrowUp":
        return MoveDirection.MOVE_UP;
      case "ArrowDown":
        return MoveDirection.MOVE_DOWN;
      case "ArrowLeft":
        return MoveDirection.MOVE_LEFT;
      case "ArrowRight":
        return MoveDirection.MOVE_RIGHT;
      default:
        return MoveDirection.NONE;
    }
  };

  const CallMoveTile = (direction) => {
    game.moveTiles(direction);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      const direction = KeyToDirection(e.key);
      if (direction !== MoveDirection.NONE) {
        e.preventDefault();
        CallMoveTile(direction);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const newGame = () => {
    game.start();
  };

  const showTimes = () => {
    if (game.game_running) {
      game.stop();
    }

    setPopup("bestScores");
  };

  return (
    <div className={styles.game_controls}>
      <button onClick={newGame} disabled={popup != "none"}>
        New Game
      </button>
      <button onClick={showTimes} disabled={popup != "none"}>
        ⏱
      </button>
    </div>
  );
};

export default observer(GameControls);
