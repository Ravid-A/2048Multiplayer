import { observer } from "mobx-react-lite";

import styles from "../../../styles/Game/Offline/GameControls.module.css";
import { useEffect } from "react";

const GameControls = ({ game }) => {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          console.log("up");
          e.preventDefault();
          break;
        case "ArrowDown":
          console.log("down");
          e.preventDefault();
          break;
        case "ArrowLeft":
          console.log("left");
          e.preventDefault();
          break;
        case "ArrowRight":
          console.log("right");
          e.preventDefault();
          break;
        default:
          break;
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
