import OfflineGame from "../components/Game/OfflineGame";

import GameObserver from "../states/GameObserver";

//import "../styles/Classic.module.css";

export default function Classic() {
  const game = new GameObserver();

  return <OfflineGame game={game} />;
}
