import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";

import GameControls from "./Speedrun/GameControls";
import GameHeading from "./Speedrun/GameHeading";
import GamePanel from "./GamePanel";

import BestScoresPopUp from "../PopUps/BestScoresPopUp";
import SpeedrunPopUp from "../PopUps/SpeedrunPopUp";

import styles from "../../styles/Game/SpeedrunGame.module.css";
import { useRouter } from "next/router";

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
        <GamePanel game={game} />
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
