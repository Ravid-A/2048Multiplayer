import { observer } from "mobx-react-lite";
import { useMemo } from "react";

import styles from "../../styles/Game/GamePanel.module.css";

const GamePanel = observer(({ game }) => {
  const GetValueColorIndex = useMemo(() => {
    return (value) => {
      if (value === 0) return 0;
      return Math.log2(value);
    };
  }, []);

  return (
    <div className={styles.game_board}>
      <div className={styles.game_panel}>
        {game.getBoard.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, cellIndex) => (
              <button
                key={cellIndex}
                className={`${styles.game_button} ${styles.button} ${
                  styles[`color_${GetValueColorIndex(cell)}`]
                }`}
              >
                {cell === 0 ? "_" : cell}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export default GamePanel;
