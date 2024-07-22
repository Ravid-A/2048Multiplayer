import { observer } from "mobx-react-lite";

import styles from "../../../styles/Game/Offline/GameHeading.module.css";

const GameHeading = ({ game }) => {
  return (
    <div className={styles.game_heading}>
      <div className={styles.scores}>
        <div className={styles.score}>
          <p>Score</p>
          <p>{game.getScore}</p>
        </div>
        <div className={styles.score}>
          <p>Best</p>
          <p>{game.bestScore}</p>
        </div>
      </div>
    </div>
  );
};

export default observer(GameHeading);
