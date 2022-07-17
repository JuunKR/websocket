import express from "express";
// import WebSocket from "ws";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.render("home"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);
const handleListen = () => console.log(`Listening on http://localhost:3000`);

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size
}

wsServer.on("connection", (socket) => {
    socket.on("join_room", (roomName) => {
      const count = countRoom(roomName) 
      if ( count < 2 | count===undefined){
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
      }else{
        socket.emit("limited")
      }
    });
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
      });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
      });
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
      });
  });

httpServer.listen(3000, handleListen);
