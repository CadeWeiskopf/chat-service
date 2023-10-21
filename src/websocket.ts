import http from "http";
import { connection, server as websocketServer } from "websocket";
import { randomUUID } from "crypto";

export interface IWsClient {
  id: string;
  connection: connection;
}

const getConnectedClient = (wsClients: IWsClient[], connection: connection) => {
  const connectionInWsClients = wsClients.find(
    ({ id: wsClientId, connection: wsClientConnection }) =>
      wsClientConnection === connection
  );
  if (connectionInWsClients) {
    return connectionInWsClients;
  }

  const newConnectionId = randomUUID();
  const connectedClient: IWsClient = { id: newConnectionId, connection };
  wsClients.push(connectedClient);
  return connectedClient;
};

export const newWebsocketServer = (
  httpServer: http.Server,
  wsClients: IWsClient[]
) => {
  const wsServer = new websocketServer({
    httpServer,
  });

  wsServer.on("request", (request) => {
    const connection = request.accept("echo-protocol", request.origin);

    const connectedClient = getConnectedClient(wsClients, connection);

    console.log(
      `${connectedClient.id} wsServer Connection accepted (${wsClients.length} total clients).`
    );

    connection.on("message", (message) => {
      if (message.type === "utf8") {
        console.log(`"Received Message:  ${message.utf8Data}"`);
        // connection.sendUTF(message.utf8Data);
      } else if (message.type === "binary") {
        console.log(
          "Received Binary Message of " + message.binaryData.length + " bytes"
        );
        // connection.sendBytes(message.binaryData);
      }
    });

    connection.on("close", (reasonCode, description) => {
      const indexOfConnectedClient = wsClients.indexOf(connectedClient);
      if (indexOfConnectedClient > -1) {
        wsClients.splice(indexOfConnectedClient, 1);
        console.log(`Removed client on close: ${connectedClient.id}`);
      } else {
        console.log(`${connectedClient.id} disconnected but not in wsClients`);
      }
    });
  });

  return wsServer;
};
