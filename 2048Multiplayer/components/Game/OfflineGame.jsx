import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import GameControls from "./Offline/GameControls";
import GameHeading from "./Offline/GameHeading";
import GamePanel from "./Offline/GamePanel";

const OfflineGame = ({ game }) => {
  useEffect(() => {
    game.setBestScoreFromLocalStorage();
  }, []);

  return (
    <div>
      <GameHeading game={game} />
      <GameControls game={game} />
      <GamePanel game={game} />
    </div>
  );
};

export default observer(OfflineGame);
