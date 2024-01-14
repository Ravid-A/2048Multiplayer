import { useState } from "react";

import CGame from "../utilities/CGame";

import OfflineGame from "../components/Game/OfflineGame";

//import "../styles/Classic.module.css";

export default function Classic() {
  const [game, setGame] = useState(new CGame());

  return (
    <>
      <OfflineGame />
    </>
  );
}
