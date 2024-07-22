import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";

import GameControls from "./Offline/GameControls";
import GameHeading from "./Offline/GameHeading";

import OfflineGameOverPopUP from "../PopUps/OfflineGameOverPopUP";

import styles from "../../styles/Game/OfflineGame.module.css";
import { useRouter } from "next/router";

const OfflineGame = observer(({ game }) => {
  const [popup, setPopup] = useState(false);

  const router = useRouter();

  useEffect(() => {
    game.setBestScoreFromDB();
  }, []);

  useEffect(() => {
    if (game.game_over) {
      setPopup(true);
    }
  }, [game.game_over]);

  const handleBackButton = () => {
    router.push("/");
  };

  // GetValueColorIndex with useMemo
  const GetValueColorIndex = useMemo(() => {
    return (value) => {
      if (value === 0) return 0;
      return Math.log2(value);
    };
  }, []);

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

      {popup && <OfflineGameOverPopUP game={game} setPopup={setPopup} />}
    </div>
  );
});

export default OfflineGame;
