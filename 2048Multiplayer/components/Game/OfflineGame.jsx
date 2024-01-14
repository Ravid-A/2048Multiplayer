import GameControls from "./Offline/GameControls";
import GameHeading from "./Offline/GameHeading";
import GamePanel from "./Offline/GamePanel";

import styles from "../../styles/Game/OfflineGame.module.css";

export default function OfflineGame() {
  return (
    <div>
      <GameHeading />
      <GameControls />
      <GamePanel />
    </div>
  );
}
