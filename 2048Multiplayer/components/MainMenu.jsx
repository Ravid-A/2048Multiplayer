import styles from "../styles/MainMenu.module.css";

export default function MainMenu() {
  const onClick = (event) => {
    console.log("clicked", event.target.value);

    document.location.href = "/" + event.target.value;
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
            value="classic"
          >
            Classic 2048
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="multiplayer"
          >
            Multiplayer
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="speedrun"
          >
            Speedrun
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="private"
          >
            Private Lobby
          </button>
        </div>
      </div>
    </>
  );
}
