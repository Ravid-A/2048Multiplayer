import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import styles from "../../../styles/Game/Multiplayer/GameHeading.module.css";

const GameHeading = ({ game }) => {
  const [elapsedTime, setElapsedTime] = useState(
    game.getElapsedTime(new Date())
  );

  useEffect(() => {
    if (!game.game_running) {
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(game.getElapsedTime(new Date()));
    }, 1);

    return () => {
      clearInterval(interval);
    };
  }, [game.game_running]);

  return (
    <div className={styles.game_heading}>
      <div className={`${styles.score} ${styles.my_score}`}>
        <p>Score</p>
        <p>{game.getScore}</p>
      </div>
      <div className={styles.time_display}>
        <p>{elapsedTime}</p>
      </div>
      <div className={`${styles.score} ${styles.opp_score}`}>
        <p>Opponent's Score</p>
        <p>{game.getOpponentScore}</p>
      </div>
    </div>
  );
};

export default observer(GameHeading);
