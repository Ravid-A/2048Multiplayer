import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { observer } from "mobx-react-lite";

import GameHeading from "./Multiplayer/GameHeading";
import GameControls from "./Multiplayer/GameControls";
import GamePanel from "./GamePanel";
import MultiplayerGameOverPopUP from "../PopUps/Multiplayer/MultiplayerGameOverPopUP";

import GetUser from "../../utilities/GetUser";

import styles from "../../styles/Game/MultiplayerGame.module.css";

const MultiplayerGame = observer(({ game }) => {
  const router = useRouter();
  const gameId = router.query.id;

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [socket, setSocket] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const [game_over, setGameOver] = useState({
    winner: "",
    reason: "",
    playAgain: false,
    opponnetWantToPlayAgain: "",
  });
  const [timeout_id, setTimeoutId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    const updateScore = (score) => {
      newSocket.emit("updateScore", gameId, score);
    };

    const endGame = (reason) => {
      newSocket.emit("shouldGameEnd", gameId, reason);
    };

    newSocket.on("connect", () => {
      newSocket.emit("init", user, gameId);
    });

    newSocket.on("waitingForOpponent", () => {
      setStatus("Waiting for opponent...");
    });

    newSocket.on("gameStart", () => {
      game.setScoreUpdate(updateScore);
      game.setEndGameFunc(endGame);
      game.start();
      setStatus("");
    });

    newSocket.on("opponentScore", (score) => {
      game.setOpponentScore(score);
    });

    newSocket.on("gameEnd", (reason, winner, wantedToPlayAgain) => {
      game.stop();

      if (wantedToPlayAgain) {
        router.push("/");
        return;
      }

      setPopUp(true);
      setGameOver({
        winner,
        reason,
        playAgain: !reason.includes("disconnected"),
      });
    });

    newSocket.on("playAgainRequest", (data) => {
      setGameOver((prev) => ({
        ...prev,
        opponnetWantToPlayAgain: data,
      }));
    });

    newSocket.on("gameRestart", () => {
      setPopUp(false);
      game.start();
    });

    newSocket.on("disconnect", () => {
      if (gameId) return;

      router.push("/");
    });

    newSocket.on("error", (data) => {
      if (popUp) return;
      console.log(popUp);

      alert(data);

      if (!timeout_id) {
        const timeout = setTimeout(() => {
          router.push("/");
        }, 2000);

        setTimeoutId(timeout);
      }
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
    if (popUp) return;

    if (socket) {
      socket.disconnect();
    }
    router.push("/");
  };

  const handlePlayAgain = () => {
    socket.emit("playAgain", gameId);
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

      {popUp && (
        <MultiplayerGameOverPopUP
          handlePlayAgain={handlePlayAgain}
          winner={game_over.winner}
          reason={game_over.reason}
          playAgain={game_over.playAgain}
          opponentWantToPlayAgain={game_over.opponnetWantToPlayAgain}
        />
      )}
    </div>
  );
});

export default MultiplayerGame;
