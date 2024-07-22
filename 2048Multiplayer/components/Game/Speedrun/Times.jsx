import { observer } from "mobx-react-lite";
import { useMemo } from "react";

import styles from "../../../styles/Game/Speedrun/Times.module.css";

const Times = observer(({ game, slice = true }) => {
  let skip = game.times.filter((time) => time !== 0).length;
  let times = [];

  if (slice) {
    if (skip >= 3) {
      times = game.times.slice(skip - 1, skip + 2);
    } else {
      times = game.times.slice(0, 3);
    }
  } else {
    skip = 0;
    times = game.times;
  }

  const indexToValue = (index) => {
    index = skip >= 3 ? index + skip - 1 : index;
    return Math.pow(2, index + 4);
  };

  const GetValueColorIndex = useMemo(() => {
    return (value) => {
      if (value === 0) return 0;
      return Math.log2(value);
    };
  }, []);

  return (
    <div className={styles.times}>
      {times.map((time, index) => (
        <div
          className={`${styles.tile_count} ${
            styles[`color_${GetValueColorIndex(indexToValue(index))}`]
          }`}
          key={index}
        >
          {indexToValue(index)}:{" "}
          <p>{!time ? "-" : game.getFormatedTime(time)}</p>
        </div>
      ))}
    </div>
  );
});

export default Times;
