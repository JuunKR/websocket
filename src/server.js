import express from "express";
// import WebSocket from "ws";
import http from "http";
import SocktIO from "socket.io";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocktIO(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, num, done) => {
    console.log(socket.id);
    console.log(socket.rooms);
    console.log(roomName.payload, num);
    socket.join(roomName.payload);
    console.log(socket.rooms);
    done("hello");
    socket.to(roomName.payload).emit("welcome", socket.nickname);
    // setTimeout(() => {
    //   done("hello!!");
    // }, 10000);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done("hello");
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// const wss = new WebSocket.Server({ server });

// const sockets = [];

// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connected to Browser!");
//   socket.on("close", () => {
//     console.log("Disconnected form the Browser");
//   });
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload.toString()}`)
//         );
//       case "nickname":
//         socket["nickname"] = message.payload.toString();
//     }
//   });
// });

httpServer.listen(3000, handleListen);
