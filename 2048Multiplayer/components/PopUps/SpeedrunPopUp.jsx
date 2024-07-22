import styles from "../../styles/SpeedrunPopUp.module.css";
import Times from "../Game/Speedrun/Times";

export default function SpeedrunPopUp({ game, setPopup }) {
  const handleReturn = () => {
    setPopup("none");
  };

  return (
    <div className={styles.PopUp}>
      <h1>Speedrun Results</h1>
      <Times game={game} slice={false} />
      <button onClick={handleReturn}>Return</button>
    </div>
  );
}
