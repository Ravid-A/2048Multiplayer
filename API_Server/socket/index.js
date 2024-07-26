import e from "express";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

class GameServer {
  constructor(io) {
    this.io = io;
    this.sockets = new Map();
    this.waitingPlayers = new Set();
    this.privateGames = new Map();
    this.activeGames = new Map();
    this.playAgainRequests = new Map();
    this.gameTimeLimit = 5 * 60 * 1000; // 5 minutes in milliseconds

    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      console.log("New connection", socket.id);
      this.sockets.set(socket.id, socket);

      socket.on("init", (user, gameId) => this.initUser(socket, user, gameId));

      socket.on("joinMatchmaking", () => this.joinMatchmaking(socket));

      socket.on("createPrivateGame", (gameId) =>
        this.createPrivateGame(socket, gameId)
      );

      socket.on("joinPrivateGame", (gameId) =>
        this.joinPrivateGame(socket, gameId)
      );

      socket.on("updateScore", (gameId, score) =>
        this.updateScore(socket, gameId, score)
      );

      socket.on("disconnect", () => this.handleDisconnect(socket));
    });
  }

  initUser(socket, user, gameId) {
    console.log("User initialized", user);
    socket.user = user;

    if (gameId) {
      const game = this.activeGames.get(gameId);

      if (!game) {
        this.EmitError(socket, "Invalid game ID");
        return;
      }

      if (!game.players.includes(user.id)) {
        this.EmitError(socket, "Invalid game ID");
        return;
      }

      const playerIndex = game.players.indexOf(user.id);
      game.players_sockets[playerIndex] = socket;

      socket.emit("waitingForOpponent");
      if (!game.players_sockets.includes(null)) {
        setTimeout(() => {
          // emit game start to both players
          game.players_sockets.forEach((playerSocket) => {
            playerSocket.emit("gameStart");
          });
        }, 2000);
      }

      setTimeout(() => {
        if (game.players_sockets.includes(null)) {
          this.EmitError(socket, "Opponent did not join");
        }
      }, 10000);
    }
  }

  joinMatchmaking(socket) {
    if (this.waitingPlayers.has(socket)) {
      this.EmitError(socket, "You are already in the queue");
      return;
    }

    if (this.waitingPlayers.size > 0) {
      const opponent = Array.from(this.waitingPlayers)[
        Math.floor(Math.random() * this.waitingPlayers.size)
      ];

      console.log("Match found", socket.id, opponent.id);

      this.waitingPlayers.delete(opponent);
      socket.emit("waitingForOpponent");
      setTimeout(() => {
        this.createGame(socket, opponent);
      }, 2000);
    } else {
      this.waitingPlayers.add(socket);
      socket.emit("waitingForOpponent");
    }
  }

  createPrivateGame(player1, gameId) {
    if (this.privateGames.has(gameId)) {
      this.EmitError(player1, "Game ID already exists");
      return;
    }

    this.privateGames.set(gameId, player1);
    this.io.to(player1.id).emit("waitingForOpponent", gameId);
  }

  joinPrivateGame(player2, gameId) {
    console.log("Joining private game", player2.id, gameId);

    // gameId to uuidv4

    const player1 = this.privateGames.get(gameId);
    if (!player1) {
      this.EmitError(player2, "Game ID does not exist");
      return;
    }

    this.privateGames.delete(gameId);

    player2.emit("joiningPrivateGame", gameId);
    setTimeout(() => {
      this.createGame(player1, player2);
    }, 2000);
  }

  createGame(player1, player2) {
    console.log("Creating game", player1.id, player2.id);
    const gameId = this.genUuidv4();
    const game = {
      players: [player1.user.id, player2.user.id],
      players_sockets: [null, null],
      timerId: setTimeout(
        () => this.endGame(gameId, "Time's up"),
        this.gameTimeLimit
      ),
    };
    this.activeGames.set(gameId, game);

    const gameDataForPlayers = {
      gameId,
      timeLimit: this.gameTimeLimit,
    };

    player1.emit("gameStart", {
      ...gameDataForPlayers,
      opponent: player2.user,
    });

    player2.emit("gameStart", {
      ...gameDataForPlayers,
      opponent: player1.user,
    });
  }

  updateScore(socket, gameId, score) {
    console.log("Updating score", gameId, score);
    const game = this.activeGames.get(gameId);
    if (!game) {
      this.EmitError(socket, "Invalid game ID");
      return;
    }

    const playerIndex = game.players.indexOf(socket.user.id);

    // send score to opponent
    const opponentIndex = playerIndex === 0 ? 1 : 0;
    game.players_sockets[opponentIndex].emit("opponentScore", score);
  }

  endGame(gameId, reason) {
    const game = this.activeGames.get(gameId);
    if (!game) return;

    clearTimeout(game.timerId);
    this.activeGames.delete(gameId);

    game.players_sockets.forEach((playerSocket) => {
      if (playerSocket) {
        playerSocket.emit("gameEnd", reason);
      }
    });
  }

  handleDisconnect(socket) {
    console.log("User disconnected", socket.id);
    this.waitingPlayers.delete(socket);

    // go through active games and end the game if the player is in it
    this.activeGames.forEach((game, gameId) => {
      const playerIndex = game.players_sockets.indexOf(socket);
      if (playerIndex !== -1) {
        this.endGame(gameId, "Opponent disconnected");
      }
    });
  }

  EmitError(socket, message) {
    socket.emit("error", message);
  }

  genUuidv4() {
    let id = uuidv4();

    while (this.activeGames.has(id)) {
      id = uuidv4();
    }

    return id;
  }
}

new GameServer(io);

const PORT = process.env.SOCKET_PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Game server listening on port ${PORT}`);
});
