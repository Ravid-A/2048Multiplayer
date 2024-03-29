import { observer } from "mobx-react-lite";

import styles from "../../../styles/Game/Offline/GameHeading.module.css";

const GameHeading = ({ game }) => {
  return (
    <div className={styles.game_heading}>
      <h1>2048</h1>
      <div className={styles.scores}>
        <div className={styles.score}>
          <p>Score</p>
          <p>{game.getScore}</p>
        </div>
        <div className={styles.score}>
          <p>Best</p>
          <p>{game.getBestScore}</p>
        </div>
      </div>
    </div>
  );
};

export default observer(GameHeading);
