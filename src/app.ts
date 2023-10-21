import express from "express";
import http from "http";
import { CHAT_SERVICE_PORT } from "./env-vars";
import { IWsClient, newWebsocketServer } from "./websocket";

const app = express();

app.get("*", (req, res) => {
  res.writeHead(404);
  res.end();
});

const server = http.createServer(app).listen(CHAT_SERVICE_PORT, () => {
  return console.log(`Chat service listening on ${CHAT_SERVICE_PORT}`);
});

const wsClients: IWsClient[] = [];
const wsServer = newWebsocketServer(server, wsClients);
