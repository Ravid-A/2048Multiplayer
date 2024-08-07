import { useEffect } from "react";
import { useRouter } from "next/router";

import OfflineGame from "../components/Game/OfflineGame";

import GetUser from '../utilities/GetUser'

import Game from "../states/GameObserver";

export default function Classic() {
  const router = useRouter();
  const game = new Game("classic");

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

  return <OfflineGame game={game} />;
}
