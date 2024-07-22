import { GameOver } from "../../states/GameObserver";

import styles from "../../styles/OfflineGameOverPopUP.module.css";

export default function OfflineGameOverPopUP({ game, setPopup }) {
  const handleReturn = () => {
    setPopup(false);
  };

  return (
    <div className={styles.PopUp}>
      <h1>Game Over!</h1>
      <p>You have {game.hasMoves == GameOver.Won ? "won" : "lost"}!</p>
      <button onClick={handleReturn}>Return</button>
    </div>
  );
}
