import { useState, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";

import GameControls from "./Speedrun/GameControls";
import GameHeading from "./Speedrun/GameHeading";

import BestScoresPopUp from "../PopUps/BestScoresPopUp";
import SpeedrunPopUp from "../PopUps/SpeedrunPopUp";

import styles from "../../styles/Game/SpeedrunGame.module.css";
import { useRouter } from "next/router";
import { set } from "mobx";

const SpeedrunGame = observer(({ game }) => {
  const router = useRouter();

  const [popup, setPopup] = useState("none");

  const handleBackButton = () => {
    router.push("/");
  };

  useEffect(() => {
    if (game.game_over) {
      setPopup("speedrun");
    }
  }, [game.game_over]);

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
        <GameControls game={game} setPopup={setPopup} popup={popup} />
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
      {popup === "bestScores" && (
        <BestScoresPopUp game={game} setPopup={setPopup} />
      )}

      {popup === "speedrun" && (
        <SpeedrunPopUp game={game} setPopup={setPopup} />
      )}
    </div>
  );
});

export default SpeedrunGame;
