const { CHAT_SERVICE_PORT } = process.env;
if (!CHAT_SERVICE_PORT) {
  throw Error("Missing env var: CHAT_SERVICE_PORT");
}
export { CHAT_SERVICE_PORT };
