const handlerLike = (io, userService) => {
  return async (toId, callback) => {
    try {
      const user = await userService.addOrRemoveLike(socket.userId, toId);
      console.log(user, "user");
      callback({
        user,
        status: "ok",
      });
      io.emit("user:update", user);
    } catch (error) {
      callback({
        user: null,
        status: "error",
      });
      console.log(error, "error");
    }
  };
};

const handlerDisLike = (io, userService) => {
  return async (toId, callback) => {
    try {
      const user = await userService.addOrRemoveDisLike(socket.userId, toId);
      console.log(user, "user");
      callback({
        user,
        status: "ok",
      });
      io.emit("user:update", user);
    } catch (error) {
      callback({
        user: null,
        status: "error",
      });
      console.log(error, "error");
    }
  };
};

module.exports = {
  handlerLike,
  handlerDisLike,
};
