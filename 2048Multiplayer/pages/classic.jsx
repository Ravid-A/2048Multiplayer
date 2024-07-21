import { useState, useEffect } from "react";

import OfflineGame from "../components/Game/OfflineGame";

import Game from "../states/GameObserver";

export default function Classic() {
  const [game, setGame] = useState(new Game());

  useEffect(() => {
    game.setCallback(setGame);
  }, []);

  return <OfflineGame game={game} />;
}
