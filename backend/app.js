const app = require("express")();
const server = require("http").createServer(app);
// upgrade http server to socket.io server
const io = require("socket.io")(server, {
  pingTimeout: 1000,
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

// sent a Hello message when connected to localhost:3000
app.get("/", (req, res) => {
  res.send("Hello");
});

//connection event handler
io.on("connection", (socket) => {
  // when received a message from client
  socket.on("chat", (data) => {
    console.log(`Message from ${data.name}: ${data.msg}`);

    let msg = {
      from: {
        name: data.name,
        avatar: data.avatar,
      },
      msg: data.msg,
    };

    // send a message to all clients else sender
    socket.broadcast.emit("chat", msg);
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.name}`);
  });
});

server.listen(3000);
