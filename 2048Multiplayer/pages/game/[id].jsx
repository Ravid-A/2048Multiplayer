import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import MultiplayerGame from "../../components/Game/MultiplayerGame";

import Game from "../../states/GameObserver";

import GetUser from "../../utilities/GetUser";

const MultiplayerGamePage = () => {
  const game = new Game("multiplayer");

  return <MultiplayerGame game={game} />;
};

export default MultiplayerGamePage;
