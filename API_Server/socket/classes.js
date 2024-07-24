export default class Sockets {
  rooms = [];

  constructor() {
    this.rooms = [];
  }

  createRoom(user) {
    const id = createRandomId();

    //check if room already exists if exists do not create
    if (this.rooms.findIndex((room) => room.id === id) !== -1) {
      throw new Error("Room already exists");
    }

    //check if user is already in a room
    if (
      this.rooms.findIndex(
        (room) => room.user_1 === user || room.user_2 === user
      ) !== -1
    ) {
      throw new Error("User already in a room");
    }

    const room = new Room(id, user);
    this.rooms.push(room);
  }

  addToRoom(id, user) {
    if (
      this.rooms.findIndex(
        (room) => room.user_1 === user || room.user_2 === user
      ) !== -1
    ) {
      throw new Error("User already in a room");
    }

    const room = this.rooms.find((room) => room.id === id);

    if (room === undefined) {
      throw new Error("Room not found");
    }

    if (room.isFull()) {
      throw new Error("Room is full");
    }

    if (room.getUserIndex(user) !== 0) {
      throw new Error("User already in room");
    }

    room.addUser(user);
  }

  removeFromRoom(id, user) {
    if (
      this.rooms.findIndex(
        (room) => room.user_1 === user || room.user_2 === user
      ) === -1
    ) {
      throw new Error("User not in a room");
    }

    const room = this.rooms.find((room) => room.id === id);

    if (room === undefined) {
      throw new Error("Room not found");
    }

    if (room.getUserIndex(user) === 0) {
      throw new Error("User not in room");
    }

    room.removeUser(user);
  }

  getRoom(id) {
    return this.rooms.find((room) => room.id === id);
  }

  closeRoom(id) {
    const index = this.rooms.findIndex((room) => room.id === id);

    if (index === -1) {
      throw new Error("Room not found");
    }

    this.rooms.splice(index, 1);
  }

  sendScore(user, score) {
    if (
      this.rooms.findIndex(
        (room) => room.user_1 === user || room.user_2 === user
      ) === -1
    ) {
      throw new Error("User not in a room");
    }

    const room = this.rooms.find(
      (room) => room.user_1 === user || room.user_2 === user
    );

    if (room === undefined) {
      throw new Error("User not in room");
    }

    if (room.getUserIndex(user) === 1) {
      // send directly to user 2
      room.user_1.to(room.user_2.id).emit("score", score);
    } else {
      // send directly to user 1
      room.user_2.to(room.user_1.id).emit("score", score);
    }
  }
}

class Room {
  id = "";
  user_1 = "";
  user_2 = "";

  constructor(id, user_1) {
    this.id = id;
    this.user_1 = user_1;
  }

  addUser(user) {
    if (this.user_1 === "") {
      this.user_1 = user;
    } else {
      this.user_2 = user;
    }
  }

  removeUser(user) {
    if (this.user_1 === user) {
      this.user_1 = "";
    } else {
      this.user_2 = "";
    }
  }

  isFull() {
    return this.user_1 !== "" && this.user_2 !== "";
  }

  isEmpty() {
    return this.user_1 === "" && this.user_2 === "";
  }

  getUsers() {
    return [this.user_1, this.user_2];
  }

  getUserCount() {
    return this.user_1 !== "" ? 1 : 0 + this.user_2 !== "" ? 1 : 0;
  }

  getUserIndex(user) {
    return this.user_1 === user ? 1 : this.user_2 === user ? 2 : 0;
  }

  getUser1() {
    return this.user_1;
  }

  getUser2() {
    return this.user_2;
  }
}

const createRandomId = () => {
  return Math.random().toString(36).substring(7);
};
