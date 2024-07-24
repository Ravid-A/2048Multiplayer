import express from "express";
import { Server } from "socket.io";

import Sockets from "./classes.js";

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

const sockets = new Sockets();

io.on("connection", (socket) => {
  console.log("New connection", socket.id);

  socket.on("create-room", (id) => {
    console.log("Create room", id);
    try {
      sockets.createRoom(socket);
      socket.emit("room-created");
    } catch (error) {
      socket.emit("room-error", { message: error.message, id: id });
    }
  });

  socket.on("join-room", (id) => {
    console.log("Join room", id);
    try {
      sockets.addToRoom(id, socket);
      socket.emit("room-joined", { id: id });
    } catch (error) {
      socket.emit("room-error", { message: error.message, id: id });
      console.log(error);
    }
  });

  socket.on("leave-room", (id) => {
    try {
      sockets.removeFromRoom(id, socket);
      socket.emit("room-left", { id: id });
    } catch (error) {
      socket.emit("room-error", { message: error.message, id: id });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  socket.on("close", () => {
    console.log("User disconnected", socket.id);
  });
});
