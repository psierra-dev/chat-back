const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
const httpServer = createServer(app);
console.log(process.env.CLIENT_URL);
const allowlist = [process.env.CLIENT_URL];

let corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  methods: ["GET", "POST", "PUT"],
});

io.use((socket, next) => {
  const data = socket.handshake.auth;

  if (!data) {
    return next(new Error("Invalid data"));
  }
  socket.data = data;
  next();
});

io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      ...socket.data,
      id,
    });
  }

  console.log("connected: ", socket.id);

  socket.emit("user:all", users);

  socket.broadcast.emit("user:connected", { id: socket.id, ...socket.data });

  socket.emit("myuser", socket.data);

  socket.on("message:private", ({ toId, message }) => {
    const sender = users.filter((user) => user?.id === socket?.id);

    io.to(toId).emit("message:private", {
      sender: sender[0],
      message,
      toId: toId,
      fromId: sender[0].id,
      self: false,
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnect: ", socket.id);
  });
});

const port = process.env.PORT || 3000;

httpServer.listen(port);
console.log("Sever connected port ", port);
