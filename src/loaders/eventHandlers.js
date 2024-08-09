const {v4: uuidv4} = require("uuid");
const UserService = require("../service/UserService");
const {handlerLike, handlerDisLike} = require("../socketService/user");
const {sendMessagePrivate} = require("../socketService/message");

function initEventHandlers({io, db, config}) {
  const userService = new UserService(db);
  io.use(async (socket, next) => {
    const data = socket.handshake.auth;

    console.log(data, "data");
    if (data !== null && !("sessionId" in data) && !("userId" in data)) {
      //login
      socket.currentUser = {
        sessionId: uuidv4(),
        userId: uuidv4(),
        ...data,
      };
      return next();
    }
    //Session
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

    socket.on("user:like", handlerLike(io, userService));

    socket.on("user:dislike", handlerDisLike(io, userService));

    socket.on("message:private", sendMessagePrivate(io, socket, allUsers));

    socket.on("user:delete", () => {
      console.log(socket.userId, "user:delete");
    });

    socket.on("disconnect", async () => {
      console.log("user disconnect", socket.currentUser.userId);
      await userService.deleteOne(socket.currentUser.userId);
      io.emit("user:disconnected", socket.currentUser.userId);
    });
  });
}

module.exports = initEventHandlers;
