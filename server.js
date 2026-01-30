const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const PORT = 3000;

const EVENTS = {

  USER_JOIN: "user:join",
  USER_JOINED: "user:joined",
  USER_LEFT: "user:left",
  USERS_LIST: "users:list",

  MESSAGE_SEND: "message:send",
  MESSAGE_SENT: "message:sent",
  MESSAGE_RECEIVE: "message:receive",
};

// setup server

// express app
const app = express();

// server http
const server = http.createServer(app);

// server nou socket io
// permite conexiuni de oriunde

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("."));

// useri
const connectedUsers = new Map();



// functii 
function getUser(socketId) {
  return connectedUsers.get(socketId);
}

function getAllUsers() {
  return Array.from(connectedUsers.values());
}

function addUser(socketId, username) {
  const user = {
    id: socketId,
    username: username
  };
  connectedUsers.set(socketId, user);
  return user;
}

function removeUser(socketId) {
  const user = getUser(socketId);
  connectedUsers.delete(socketId);
  return user;
}


// event handlers


io.on("connection", (socket) => {
  console.log(`user with ${socket.id} connected`);

  socket.on(EVENTS.USER_JOIN, (username) => {

    // validare username
    if(!username || typeof username !== 'string') {
      console.log('username invalid');
      return;
    }

    console.log(`user ${username} joined`);


    const user = addUser(socket.id, username);

    // trimite pe server info ca user-ul a dat join
    socket.broadcast.emit(EVENTS.USER_JOINED, user);

    io.emit(EVENTS.USERS_LIST, getAllUsers());
  });


  socket.on(EVENTS.MESSAGE_SEND, (data) => {
    const sender = getUser(socket.id);
    const text = typeof data === "string" ? data : data?.message;

    if(!text || !text.trim()) {
      return;
    }

    const messageData = {
      from: socket.id,
      username: sender?.username ?? "Unknown",
      message: text.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log(`${messageData.username} message:`, messageData.message);

    socket.broadcast.emit(EVENTS.MESSAGE_RECEIVE, messageData);

    socket.emit(EVENTS.MESSAGE_SENT, {
      message: messageData.message,
      timestamp: messageData.timestamp,
    });
  });

  // cand un user se deconecteaza, anunta pe toti ceilalti useri
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    connectedUsers.delete(socket.id);

    if (user) {
      console.log(`user ${user.username} left the chat`);
      io.emit(EVENTS.USER_LEFT, {
        id: socket.id,
        username: user.username,
      });
    }
  });
});

// start server pe port 3000
server.listen(PORT, () => {
  console.log(`serverul merge pe ${PORT}`);
});
