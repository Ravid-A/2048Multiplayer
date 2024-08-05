import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import io from "socket.io-client";

import GetSocketUrl from "../utilities/GetSocketUrl";

import styles from "../styles/Matchmaking.module.css";

const Matchmaking = ({ user }) => {
  const router = useRouter();

  const [status, setStatus] = useState("Searching for opponent...");
  const [opponent, setOpponent] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(GetSocketUrl());
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("init", user);
      newSocket.emit("joinMatchmaking", user.id);
    });

    newSocket.on("waitingForOpponent", () => {
      setStatus("Waiting for opponent...");
    });

    newSocket.on("gameStart", (data) => {
      setStatus("Opponent found!");
      setOpponent(data.opponent);
      setGameId(data.gameId);
      // Redirect to game page after a short delay
      setTimeout(() => {
        newSocket.removeAllListeners();
        router.replace(`/game/${data.gameId}`);
      }, 2000);
    });

    newSocket.on("disconnect", () => {
      if (gameId) return;

      router.push("/");
    });

    newSocket.on("error", (data) => {
      setStatus(data);

      setTimeout(() => {
        setStatus("Waiting for opponent...");
      }, 2000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const handleBackButton = () => {
    if (gameId) return;

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

        <div className={styles.matchmakingContent}>
          <h2>{status}</h2>
          {opponent && (
            <div className={styles.opponentInfo}>
              <h3>Opponent found:</h3>
              <p>{opponent.username}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;
