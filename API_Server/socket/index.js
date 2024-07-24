import express from "express";
import { Server } from "socket.io";

const PORT = process.env.SOCKET_PORT || 3002;

const app = express();

const server = app.listen(3002, () => {
  console.log(`Socket: Listening on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New connection", socket.id);

  const sendMessage = (message) => {
    socket.broadcast.emit("message", {
      username: socket.username,
      message: `${socket.username}: ${message}`,
      show_avatar: true,
    });
  };

  const emitFromServer = (type, message) => {
    io.sockets.emit(type, message);
  };

  // Return to React-Native

  // emit the username when the user connects
  socket.on("username", (username) => {
    socket.username = username;
    console.log(`${username} connected`);
    emitFromServer("user_state_change", {
      username: username,
      message: `${username} connected`,
      show_avatar: false,
    });
  });

  // emit the message when the user sends a message
  socket.on("message", (data) => {
    if (!socket.username) {
      return;
    }

    console.log(`${socket.username} sent a message: ${data}`);
    sendMessage(data);
  });

  // emit the message when the user disconnects
  socket.on("disconnect", () => {
    if (!socket.username) {
      return;
    }

    console.log(`${socket.username} disconnected`);
    emitFromServer("user_state_change", {
      username: socket.username,
      message: `${socket.username} disconnected`,
      show_avatar: false,
    });
    socket.username = null;
  });

  socket.on("user_disconnect", () => {
    if (!socket.username) {
      return;
    }

    console.log(`${socket.username} disconnected`);
    emitFromServer("user_state_change", {
      username: socket.username,
      message: `${socket.username} disconnected`,
      show_avatar: false,
    });
    socket.username = null;
  });
});
