import { useState } from "react";

import CGame from "../utilities/CGame";

import GamePanel from "../components/GamePanel";

export default function Classic() {
  const [game, setGame] = useState(new CGame());

  return (
    <>
      <GamePanel />
    </>
  );
}
