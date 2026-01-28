const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

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


// serve all files din folderu curent
app.use(express.static('.'));

// useri
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log(`user with ${socket.id} connected`);

  // cand un user intra in server
  socket.on('user:join', (username) => {
    console.log(`user ${username} joined`);

    // adaug user-ul la map
    connectedUsers.set(socket.id, {
        id: socket.id,
        username: username
    });

    // trimite pe server info ca user-ul a dat join
    io.emit('user:joined', {
        id: socket.id,
        username: username
    });

    // trimit user-ului info despre ceilalti
    socket.emit('users:list', Array.from(connectedUsers.values()));
  });


  // user-ul trimite un mesaj
  socket.on('message:send', (data) => {
    const sender = connectedUsers.get(socket.id);


    const messageData = {
        from: socket.id,
        username: sender.username,
        message: data.message,
        timestamp: new Date().toISOString()
    };

    console.log(messageData.message);

    // trimit catre toti in afara de cel care trimite
    socket.broadcast.emit('message:receive', messageData);

    // confirm cu userul care a trimiss
    socket.emit('message:send', {
        message: data.message,
        timestamp: messageData.timestamp
    });
  });


  // cand un user se deconecteaza, anunta pe toti ceilalti useri
  socket.on("disconnect", () => {
    const user = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);

    if (user) {
      console.log(`user ${user.username} left the chat`);
      io.emit("user:left", {
        id: socket.id,
        username: user.username,
      });
    }
  });
});

// start server pe port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`serverul merge pe ${PORT}`);
});
