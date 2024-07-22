import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import styles from "../../../styles/Game/Speedrun/GameHeading.module.css";

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
      <div className={styles.times}>
        <Times game={game} />
      </div>
      <div className={styles.time_display}>
        <p>{elapsedTime}</p>
      </div>
      <div className={styles.scores}>
        <div className={styles.score}>
          <p>Score</p>
          <p>{game.getScore}</p>
        </div>
      </div>
    </div>
  );
};

const Times = ({ game }) => {
  const skip = game.times.filter((time) => time !== 0).length;
  let times = [];

  if (skip >= 3) {
    times = game.times.slice(skip - 1, skip + 2);
  } else {
    times = game.times.slice(0, 3);
  }

  const indexToValue = (index) => {
    index = skip >= 3 ? index + skip - 1 : index;
    return Math.pow(2, index + 4);
  };

  return (
    <>
      {times.map((time, index) => (
        <div className={styles.tile_count} key={index}>
          {indexToValue(index)}: {!time ? "-" : game.getElapsedTime(time)}
        </div>
      ))}
    </>
  );
};

export default observer(GameHeading);
