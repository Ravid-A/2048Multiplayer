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
import MultiplayerStatusPopUP from "../PopUps/Multiplayer/MultiplayerStatusPopUP";

import GetUser from "../../utilities/GetUser";

import styles from "../../styles/Game/MultiplayerGame.module.css";

const MultiplayerGame = observer(({ game }) => {
  const router = useRouter();
  const gameId = router.query.id;

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [socket, setSocket] = useState(null);
  const [popUp, setPopUp] = useState("none");
  const [game_over, setGameOver] = useState({
    winner: "",
    reason: "",
    playAgain: false,
    opponnetWantToPlayAgain: "",
  });

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
      setPopUp("status");
    });

    newSocket.on("gameStart", () => {
      game.setScoreUpdate(updateScore);
      game.setEndGameFunc(endGame);
      game.start();
      setStatus("");
      setPopUp("none");
    });

    newSocket.on("opponentScore", (score) => {
      game.setOpponentScore(score);
    });

    newSocket.on("gameEnd", (reason, winner, from_disconnected) => {
      game.stop();

      if (from_disconnected) {
        setPopUp("game_over");
        setGameOver({
          winner: null,
          reason,
          playAgain: false,
          opponnetWantToPlayAgain: "",
        });
        return;
      }

      setPopUp("game_over");
      setGameOver({
        winner,
        reason,
        playAgain: !reason.includes("disconnected"),
        opponnetWantToPlayAgain: "",
      });
    });

    newSocket.on("playAgainRequest", (data) => {
      setGameOver((prev) => ({
        ...prev,
        opponnetWantToPlayAgain: data,
      }));
    });

    newSocket.on("gameRestart", () => {
      setPopUp("none");
      game.start();
    });

    newSocket.on("disconnect", () => {
      if (gameId) return;

      router.push("/");
    });

    newSocket.on("error", (data) => {
      if (popUp != "none") return;

      game.stop();
      setStatus(data);
      setPopUp("error");
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
    if (popUp != "none") return;

    if (socket) {
      socket.disconnect();
    }
    router.push("/");
  };

  const handlePlayAgain = () => {
    setGameOver((prev) => ({
      ...prev,
      opponnetWantToPlayAgain: "You",
    }));
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
        <GameControls game={game} />
        <GamePanel game={game} />
      </div>

      {popUp == "game_over" && (
        <MultiplayerGameOverPopUP
          handlePlayAgain={handlePlayAgain}
          winner={game_over.winner}
          reason={game_over.reason}
          playAgain={game_over.playAgain}
          opponentWantToPlayAgain={game_over.opponnetWantToPlayAgain}
        />
      )}

      {popUp != "none" && popUp != "game_over" && (
        <MultiplayerStatusPopUP status={status} error={popUp == "error"} />
      )}
    </div>
  );
});

export default MultiplayerGame;
