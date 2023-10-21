import { client as websocketClient, Message, connection } from "websocket";
import { CHAT_SERVICE_PORT } from "./env-vars";
import { randomUUID } from "crypto";

class Client {
  private static randomMessages(client: Client) {
    const sendRandomMessage = () => {
      client.connection.send(`New random message ${new Date().getTime()}`);
      const min = 5000;
      const max = 10000;
      const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
      setTimeout(sendRandomMessage, randomValue);
    };
    sendRandomMessage();
  }

  private client: websocketClient;
  private clientId: string;
  private connection: connection;

  private handleMessage = (message: Message) => {
    if (message.type === "utf8") {
      console.log(`${this.clientId} New Message: ${message.utf8Data}`);
    } else if (message.type === "binary") {
      console.log(
        `${this.clientId} New binary message: ${message.binaryData.length} bytes`
      );
    }
  };

  constructor(id: string) {
    this.client = new websocketClient();
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

      connection.on("error", (error) => {
        console.log(`${this.clientId} Connection Error: ${error.toString()}`);
      });

      connection.on("close", () => {
        console.log(`${this.clientId} echo-protocol Connection Closed`);
      });

      connection.on("message", this.handleMessage);

      Client.randomMessages(this);
    });

    this.client.connect(
      `ws://localhost:${CHAT_SERVICE_PORT}/`,
      "echo-protocol"
    );
  }
}

const NUMBER_OF_DUMMY_CLIENTS = 3;
const dummyClients: Client[] = [];
for (let i = NUMBER_OF_DUMMY_CLIENTS; i-- > 0; ) {
  const randomId = randomUUID();
  dummyClients.push(new Client(randomId));
}
