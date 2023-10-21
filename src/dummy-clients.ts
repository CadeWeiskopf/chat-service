import { Client } from "./client";
import { randomUUID } from "crypto";

const NUMBER_OF_DUMMY_CLIENTS = 3;
const dummyClients: Client[] = [];

const sendRandomMessages = (client: Client) => {
  client.sendMessage(`New random message ${new Date().getTime()}`);
  const min = 1000;
  const max = 10000;
  const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
  setTimeout(sendRandomMessages, randomValue, client);
};

for (let i = NUMBER_OF_DUMMY_CLIENTS; i-- > 0; ) {
  const randomId = randomUUID();
  dummyClients.push(new Client(randomId, sendRandomMessages));
}
