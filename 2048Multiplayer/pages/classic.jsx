import OfflineGame from "../components/Game/OfflineGame";

import Game from "../states/GameObserver";

export default function Classic() {
  const game = new Game("classic");

  return <OfflineGame game={game} />;
}
