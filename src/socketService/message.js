const sendMessagePrivate = (io, socket, allUsers) => {
  return ({toId, message}) => {
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
  };
};

module.exports = {
  sendMessagePrivate,
};
