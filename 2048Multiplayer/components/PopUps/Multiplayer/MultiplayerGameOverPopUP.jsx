import { useRouter } from "next/router";
import { useState } from "react";

import styles from "../../../styles/MultiplayerGameOverPopUP.module.css";

export default function MultiplayerGameOverPopUP({
  handlePlayAgain,
  winner,
  reason,
  playAgain,
  opponentWantToPlayAgain,
}) {
  const router = useRouter();

  const [pressedPlayAgain, setPressedPlayAgain] = useState(false);

  const handleReturn = () => {
    router.push("/");
  };

  const WantToPlayAgain = () => {
    setPressedPlayAgain(true);
    handlePlayAgain();
  };

  return (
    <div className={styles.PopUp}>
      <h1>Game Over!</h1>
      <p>You have {winner ? "won" : "lost"}!</p>
      <p>{reason}</p>
      <button onClick={handleReturn}>Go Home</button>
      {playAgain && (
        <button disabled={pressedPlayAgain} onClick={WantToPlayAgain}>
          Play Again
        </button>
      )}
      {opponentWantToPlayAgain && (
        <p>{opponentWantToPlayAgain} wants to play again!</p>
      )}
    </div>
  );
}
