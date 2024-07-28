import { useEffect, useState } from "react";
import styles from "../../styles/BestScoresPopUp.module.css";
import Times from "../Game/Speedrun/Times";

export default function BestScoresPopUp({ game, setPopup }) {
  const [times, setTimes] = useState([]);

  const handleReturn = () => {
    setPopup("none");
  };

  const getTimes = async () => {
    const times = await game.getBestTimes();
    setTimes(times);
  };

  useEffect(() => {
    getTimes();
  }, [game]);

  const game_obj = {
    times: times,
    getFormatedTime: game.getFormatedTime,
  };

  return (
    <div className={styles.PopUp}>
      <h1>Best Scores</h1>
      <Times game={game_obj} slice={false} />
      <button onClick={handleReturn}>Return</button>
    </div>
  );
}
