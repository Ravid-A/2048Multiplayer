import { useEffect } from "react";
import { useRouter } from "next/router";

import SpeedrunGame from "../components/Game/SpeedrunGame";

import GetUser from '../utilities/GetUser'

import Game from "../states/GameObserver";

export default function Speedrun() {
  const router = useRouter();
  const game = new Game("speedrun");

  const getUser = async () => {
    const user_data = await GetUser();

    if (!user_data) {
      router.push("/");
      return;
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return <SpeedrunGame game={game} />;
}
