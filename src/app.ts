import express from "express";
import http from "http";
import { CHAT_SERVICE_PORT } from "./env-vars";
import { IWsClient, newWebsocketServer } from "./websocket";
import fs from "fs";

process.chdir("./dist");

const joinChatPage = fs.readFileSync("./public/pages/join-chat.html", "utf-8");
const chatPage = fs.readFileSync("./public/pages/chat.html", "utf-8");

const app = express();

app.use(express.static("./public"));

app.get("/chat", (req, res) => {
  res.send(joinChatPage);
});

app.post("/chat", (req, res) => {
  res.send(chatPage);
});

app.get("*", (req, res) => {
  res.writeHead(404);
  res.end();
});

const server = http.createServer(app).listen(CHAT_SERVICE_PORT, () => {
  return console.log(`Chat service listening on ${CHAT_SERVICE_PORT}`);
});

const wsClients: IWsClient[] = [];
const wsServer = newWebsocketServer(server, wsClients);
