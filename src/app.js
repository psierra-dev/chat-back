const mongoose = require("mongoose");
const {Server} = require("socket.io");
const initEventHandlers = require("./loaders/eventHandlers");
const createExpressApp = require("./loaders/express");

const {connectMongoDB} = require("./db");
const db = require("./db/models");

function createApp(httpServer, config) {
  const app = createExpressApp(db);
  httpServer.on("request", app);

  const io = new Server(httpServer, {
    cors: config.cors,
    methods: ["GET", "POST", "PUT"],
  });

  connectMongoDB(mongoose);
  initEventHandlers({io, db});
}

module.exports = createApp;
