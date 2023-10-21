import {
  client as WebsocketClient,
  Message as WebSocketMessage,
  connection as WebSocketConnection,
} from "websocket";
import { CHAT_SERVICE_PORT } from "./env-vars";

interface IMessage {
  clientId: string;
  message: string;
}

export class Client {
  private client: WebsocketClient;
  private clientId: string;
  private connection: WebSocketConnection;

  sendMessage = (message: string) => {
    const data: IMessage = {
      clientId: this.clientId,
      message,
    };
    this.connection.send(JSON.stringify(data));
  };

  private receiveMessage = (message: WebSocketMessage) => {
    if (message.type === "utf8") {
      console.log(`${this.clientId} New WebSocketMessage: ${message.utf8Data}`);
    } else if (message.type === "binary") {
      console.log(
        `${this.clientId} New binary message: ${message.binaryData.length} bytes`
      );
    }
  };

  constructor(id: string) {
    this.client = new WebsocketClient();
    this.clientId = id;
    console.log(`New client instantiated: ${this.clientId}`);

    this.client.on("connectFailed", (error) => {
      console.log(
        `${this.clientId} Client Connect Failed Error: ${error.toString()}`
      );
    });

    this.client.on("connect", (connection) => {
      console.log(`${this.clientId} WebSocket Client Connected`);
      this.connection = connection;
      this.sendMessage("Hello world!");

      connection.on("error", (error) => {
        console.log(`${this.clientId} Connection Error: ${error.toString()}`);
      });

      connection.on("close", () => {
        console.log(`${this.clientId} echo-protocol Connection Closed`);
      });

      connection.on("message", this.receiveMessage);
    });

    this.client.connect(
      `ws://localhost:${CHAT_SERVICE_PORT}/`,
      "echo-protocol"
    );
  }
}
