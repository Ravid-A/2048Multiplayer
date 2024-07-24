import { useState, useEffect } from "react";

// socket.io-client
//import { io } from "socket.io-client";

const PrivateLobby = () => {
  //const socket = io("http://localhost:3002");

  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    //socket.emit("create-room", roomId);
  };

  const joinRoom = () => {
    //socket.emit("join-room", roomId);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Room ID"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={createRoom}>Create Room</button>
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default PrivateLobby;
