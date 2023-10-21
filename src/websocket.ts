import http from "http";
import { connection, server as websocketServer } from "websocket";
import { randomUUID } from "crypto";

export interface IWsClient {
  id: string;
  connection: connection;
}

export const newWebsocketServer = (
  httpServer: http.Server,
  wsClients: IWsClient[]
) => {
  const wsServer = new websocketServer({
    httpServer,
    // You should not use autoAcceptConnections for production
    // autoAcceptConnections: false,
  });

  wsServer.on("request", (request) => {
    const connection = request.accept("echo-protocol", request.origin);

    let connectedClient: IWsClient | undefined;
    const connectionInWsClients = wsClients.find(
      ({ id: wsClientId, connection: wsClientConnection }) =>
        wsClientConnection === connection
    );
    if (!connectionInWsClients) {
      const newConnectionId = randomUUID();
      connectedClient = { id: newConnectionId, connection };
      wsClients.push(connectedClient);
    }
    console.log(
      `${connectedClient.id} wsServer Connection accepted (${wsClients.length} total clients).`
    );

    connection.on("message", (message) => {
      if (message.type === "utf8") {
        console.log(`"Received Message:  ${message.utf8Data}"`);
        connection.sendUTF(message.utf8Data);
      } else if (message.type === "binary") {
        console.log(
          "Received Binary Message of " + message.binaryData.length + " bytes"
        );
        connection.sendBytes(message.binaryData);
      }
    });

    connection.on("close", (reasonCode, description) => {
      if (connectedClient) {
        const indexOfConnectedClient = wsClients.indexOf(connectedClient);
        if (indexOfConnectedClient > -1) {
          wsClients.splice(indexOfConnectedClient, 1);
          console.log(`Removed client on close: ${connectedClient.id}`);
        } else {
          console.log(
            `Error: ${connectedClient.id} disconnected but not in wsClients`
          );
        }
      } else {
        console.log(
          `Error: ${connection.remoteAddress} disconnected but never set connectedClient`
        );
      }
    });
  });

  return wsServer;
};
