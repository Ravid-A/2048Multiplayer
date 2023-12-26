import { useState } from "react";

import CGame from "../utilities/CGame";

import GameHeading from "../components/GameHeading";
import GameControls from "../components/GameControls";
import GamePanel from "../components/GamePanel";

export default function Classic() {
  const [game, setGame] = useState(new CGame());

  return (
    <>
      <GameHeading />
      <GameControls />
      <GamePanel />
    </>
  );
}
