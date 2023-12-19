import styles from "../styles/GamePanel.module.css";

export default function GamePanel({ online = false }) {
  return (
    <>
      <div className={styles.heading}>
        <h1> Playing {online ? "Online" : "Offline"}</h1>
        <h1 className={styles.title}>2048</h1>
        <div className={styles.scores_container}>
          <div id="score" class={styles.score_container}>
            0
          </div>
          <div id="best" class={styles.best_container}>
            0
          </div>
        </div>
      </div>

      <div className={styles.above_game}>
        <p className={styles.game_intro}>
          Join the numbers and get to the <strong>2048 tile!</strong>
        </p>
        <button id="newgame" className={styles.restart_button}>
          New Game
        </button>
      </div>
    </>
  );
}
