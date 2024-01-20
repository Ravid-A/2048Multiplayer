import { observer } from "mobx-react-lite";

import styles from "../../../styles/Game/Offline/GameControls.module.css";

const GameControls = ({ game }) => {
  return (
    <div className={styles.game_controls}>
      <button onClick={game.start}>New Game</button>
    </div>
  );
};

export default observer(GameControls);
