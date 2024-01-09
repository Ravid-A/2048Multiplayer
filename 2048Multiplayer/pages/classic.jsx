import { useState } from "react";

import CGame from "../utilities/CGame";

import GameHeading from "../components/Game/GameHeading";
import GameControls from "../components/Game/GameControls";
import GamePanel from "../components/Game/GamePanel";

//import "../styles/Classic.module.css";

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
