import { Client } from "./client";
import { randomUUID } from "crypto";

const sendRandomMessages = (client: Client) => {
  client.sendMessage(`New random message ${new Date().getTime()}`);
  const timeout = 10000;
  // setTimeout(sendRandomMessages, timeout, client);
};

const numOfClients = 100;
const promises = [];
for (let i = numOfClients; i-- > 0; ) {
  const randomId = randomUUID();
  promises.push(
    new Promise((resolve) => {
      const client = new Client(randomId, () => {
        resolve(client);
      });
    })
  );
}

Promise.all(promises)
  .then((clients) => {
    clients.forEach((client) => {
      sendRandomMessages(client);
    });
    console.log(
      `Clients created: ${clients}\n------------------------------------\n\n`
    );
  })
  .catch((error) => {
    console.error("Error creating clients:", error);
  });
