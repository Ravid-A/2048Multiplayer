import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import io from "socket.io-client";

import GetSocketUrl from "../utilities/GetSocketUrl";

import styles from "../styles/PrivateLobby.module.css";

const PrivateLobby = ({ user }) => {
  const router = useRouter();

  const [status, setStatus] = useState("Create or join to a private lobby:");
  const [opponent, setOpponent] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameIdInput, setGameIdInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const newSocket = io(GetSocketUrl());
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("init", user);
    });

    newSocket.on("waitingForOpponent", (data) => {
      setStatus("Waiting for opponent...");
      setGameId(data);
    });

    newSocket.on("joiningPrivateGame", (data) => {
      setStatus("Joining game...");
      setGameId(data);
    });

    newSocket.on("gameStart", (data) => {
      setStatus("Joined game!");
      setOpponent(data.opponent);
      setTimeout(() => {
        newSocket.removeAllListeners();
        router.replace(`/game/${data.gameId}`);
      }, 2000);
    });

    newSocket.on("error", (data) => {
      setError(data);

      setTimeout(() => {
        setError("");
      }, 2000);
    });

    newSocket.on("disconnect", () => {
      if (gameId) return;

      router.push("/");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const handleBackButton = () => {
    if (gameId) {
      socket.emit("leavePrivateGame", gameId);
    }

    if (socket) {
      socket.disconnect();
    }
    router.push("/");
  };

  const handleCreate = () => {
    if (socket) {
      socket.emit("createPrivateGame", gameIdInput);
    }
  };

  const handleJoin = () => {
    if (socket) {
      socket.emit("joinPrivateGame", gameIdInput);
    }
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
          {gameId ? (
            <>
              <h2 className={styles.status}>{status}</h2>
              {opponent ? (
                <div className={styles.opponentInfo}>
                  <h3>Opponent Name:</h3>
                  <p>{opponent.username}</p>
                </div>
              ) : (
                <div className={styles.opponentInfo}>
                  <h3>Game ID:</h3>
                  <p>{gameId}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className={styles.status}>{status}</h2>
              <input
                className={styles.input}
                value={gameIdInput}
                type="text"
                placeholder="Enter lobby code"
                onChange={(e) => setGameIdInput(e.target.value)}
              />
              <div className={styles.buttons}>
                <button className={styles.button} onClick={handleJoin}>
                  Join
                </button>
                <button className={styles.button} onClick={handleCreate}>
                  Create
                </button>
              </div>
              {error && <div className={styles.error}>{error}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateLobby;
