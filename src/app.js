const express = require("express");
const mongoose = require("mongoose");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const { connectMongoDB } = require("./db");

const UserService = require("./service/UserService");
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
  console.log(corsOptions, "corsOptions");
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
connectMongoDB(mongoose);

const userService = new UserService();

app.post("/login", async (req, res) => {
  const data = req.body;
  console.log(data, "data");

  try {
    const isUsed = await userService.findOne({ username: data.username });

    if (isUsed) {
      return res.status(400).send("username en uso");
    }

    res.status(200).send("ready");
  } catch (error) {
    res.status(500).send(error);
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  methods: ["GET", "POST", "PUT"],
});

io.use(async (socket, next) => {
  const data = socket.handshake.auth;

  console.log(data, "data");
  /*if (sessionId) {
    const user = await userService.findOne({ sessionId: sessionId });
    console.log(user, "--user");
    if (user) {
      const { sessionId, userId, ...userData } = user;
      socket.userId = userId;
      socket.sessionId = sessionId;
      socket.type = "update";
      return next();
    }
  }*/

  console.log(!("sessionId" in data), "dataSessionId");
  if (!("sessionId" in data) && !("userId" in data)) {
    socket.currentUser = {
      sessionId: uuidv4(),
      userId: uuidv4(),
      ...data,
    };
    return next();
  }

  socket.currentUser = data;
  next();
});

io.on("connection", async (socket) => {
  console.log(socket.currentUser, "currentUser");
  await userService.create({
    ...socket.currentUser,
    online: true,
  });

  socket.emit("user:session", socket.currentUser);

  socket.join(socket.currentUser.userId);

  console.log("connected: ", socket.currentUser.userId);
  const allUsers = await userService.findAll();

  const filterdCurrentUser = allUsers?.filter(
    (u) => u.userId !== socket.currentUser.userId
  );

  socket.emit("user:all", filterdCurrentUser);

  //const currentUser = usersStorage.filter((user) => user.id === socket.id);
  const currentUser = await userService.findOne({
    userId: socket.currentUser.userId,
  });

  socket.broadcast.emit("user:connected", currentUser);

  socket.emit("user:current", currentUser);

  socket.on("user:like", async (toId, callback) => {
    //socket.emit("user:all", usersStorage);
    try {
      const user = await userService.addOrRemoveLike(socket.id, toId);
      console.log(user, "user");
      callback({
        user,
        status: "ok",
      });
      io.emit("user:update", user);
    } catch (error) {
      console.log(error, "error");
    }
  });

  socket.on("user:dislike", async (toId, callback) => {
    //socket.emit("user:all", usersStorage);
    try {
      const user = await userService.addOrRemoveDisLike(socket.id, toId);
      console.log(user, "user");
      callback({
        user,
        status: "ok",
      });
      io.emit("user:update", user);
    } catch (error) {
      console.log(error, "error");
    }
  });

  socket.on("message:private", ({ toId, message }) => {
    const sender = allUsers.filter(
      (user) => user?.userId === socket?.currentUser.userId
    );

    io.to(toId).emit("message:private", {
      sender: sender[0],
      message,
      toId: toId,
      fromId: sender[0].userId,
      self: false,
    });
  });

  socket.on("user:delete", () => {
    console.log(socket.userId, "user:delete");
  });

  socket.on("disconnect", async () => {
    console.log("user disconnect", socket.currentUser.userId);
    await userService.deleteOne(socket.currentUser.userId);
    io.emit("user:disconnected", socket.currentUser.userId);
  });
});

module.exports = { httpServer };
