import { observer } from "mobx-react-lite";

import styles from "../../../styles/Game/Offline/GamePanel.module.css";

const GamePanel = ({ game }) => {
  return (
    <div className={styles.game_panel}>
      {game.getBoard.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className={`${styles.cell}`}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default observer(GamePanel);
