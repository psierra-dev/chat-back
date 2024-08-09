const {createServer} = require("node:http");
const createApp = require("./src/app");
const config = require("./src/config");

const httpServer = createServer();

createApp(httpServer, {
  cors: "*",
});

httpServer.listen(config.port, () => {
  console.log("Sever connected port ", config.port);
});
