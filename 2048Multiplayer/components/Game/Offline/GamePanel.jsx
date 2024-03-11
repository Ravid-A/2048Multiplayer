import { observer } from "mobx-react-lite";

import styles from "../../../styles/Game/Offline/GamePanel.module.css";

const GamePanel = ({ game }) => {
  const GetValueIndex = (value) => {
    let index = 0;
    while (Math.pow(2, index) != value && index <= 11) {
      if (Math.pow(2, index) > value) {
        return -1;
      }

      index++;
    }
    return index - 1;
  };

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
