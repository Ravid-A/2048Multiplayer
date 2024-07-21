import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

import GameControls from "./GameControls";
import GameHeading from "./Offline/GameHeading";

import styles from "../../styles/Game/OfflineGame.module.css";

const OfflineGame = ({ game }) => {
  useEffect(() => {
    game.setBestScoreFromLocalStorage();
  }, []);

  const handleBackButton = () => {
    //game.reset();
  };

  const GetValueColorIndex = (value) => {
    if (value === 0) return 0;

    const index = Math.log2(value);
    return index >= 1 && index <= 11 ? index - 1 : -1;
  };

  return (
    <div className={styles.game}>
      <div className={styles.game_container}>
        <div className={styles.backButton} onClick={handleBackButton}>
          <FontAwesomeIcon icon={faLeftLong} />
        </div>
        <div className={styles.Titles}>
          <div className={styles.Title}>2048</div>
          <div className={styles.SubTitle}>Multiplayer</div>
        </div>

        <GameHeading game={game} />
        <GameControls game={game} />
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
      </div>
    </div>
  );
};

export default OfflineGame;
