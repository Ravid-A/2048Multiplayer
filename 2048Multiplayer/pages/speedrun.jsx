import SpeedrunGame from "../components/Game/SpeedrunGame";

import Game from "../states/GameObserver";

export default function Speedrun() {
  const game = new Game("speedrun");

  return <SpeedrunGame game={game} />;
}
