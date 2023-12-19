import styles from "../styles/MainMenu.module.css";

export default function MainMenu() {
  const onClick = (event) => {
    console.log("clicked", event.target.value);

    //redirect to the appropriate page
    window.location.href = "/" + event.target.value;
  };

  return (
    <>
      <div className={styles.MainMenu}>
        <div className={styles.Titles}>
          <div className={styles.Title}>2048</div>
          <div className={styles.SubTitle}>Multiplayer</div>
        </div>

        <div className={styles.Menu}>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="practice"
          >
            Practice (OFFLINE)
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="together"
          >
            Together (ONLINE)
          </button>
          {false && (
            <button
              className={styles.MenuButton}
              onClick={onClick}
              value="competition"
              disabled={true}
            >
              Competition (ONLINE)
            </button>
          )}
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="leaderboard"
          >
            Leaderboard
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="rules"
            disabled={true}
          >
            Rules
          </button>
        </div>
      </div>
    </>
  );
}
