import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import io from "socket.io-client";

import GameHeading from "./Multiplayer/GameHeading";
import GameControls from "./Multiplayer/GameControls";
import GamePanel from "./GamePanel";

import GetUser from "../../utilities/GetUser";

import styles from "../../styles/Game/MultiplayerGame.module.css";
import { observer } from "mobx-react-lite";

const MultiplayerGame = observer(({ game }) => {
  const router = useRouter();
  const gameId = router.query.id;

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    const updateScore = (score) => {
      console.log(score);
      newSocket.emit("updateScore", gameId, score);
    };

    newSocket.on("connect", () => {
      newSocket.emit("init", user, gameId);
    });

    newSocket.on("waitingForOpponent", () => {
      setStatus("Waiting for opponent...");
    });

    newSocket.on("gameStart", () => {
      game.setScoreUpdate(updateScore);
      game.start();
      setStatus("");
    });

    newSocket.on("opponentScore", (score) => {
      game.setOpponentScore(score);
    });

    newSocket.on("gameEnd", (data) => {
      console.log(data);
      game.stop();
    });

    newSocket.on("disconnect", () => {
      if (gameId) return;

      router.push("/");
    });

    newSocket.on("error", (data) => {
      alert(data);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const getUser = async () => {
    const user = await GetUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleBackButton = () => {
    if (socket) {
      socket.disconnect();
    }
    router.push("/");
  };

  return (
    <div className={styles.game}>
      <div className={styles.game_container}>
        <div className={styles.backButton} onClick={handleBackButton}>
          <FontAwesomeIcon icon={faLeftLong} />
        </div>
        <div className={styles.Titles}>
          <div className={styles.Title}>2048</div>
          <div className={styles.SubTitle}>Multiplayer</div>
        </div>

        <GameHeading game={game} />
        <GameControls game={game} status={status} />
        <GamePanel game={game} />
      </div>
    </div>
  );
});

export default MultiplayerGame;
