import { Client } from "./client";
import { randomUUID } from "crypto";

const sendRandomMessages = (client: Client) => {
  client.sendMessage(`New random message ${new Date().getTime()}`);
  const min = 1000;
  const max = 10000;
  const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
  setTimeout(sendRandomMessages, randomValue, client);
};

const randomId = randomUUID();
const dummy = new Client(randomId, sendRandomMessages);
