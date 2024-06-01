let users = [];

function userJoin(user) {
  users.push(user);
}

function findOneUser(id) {
  return users.find((u) => u.id === id);
}

function likeUser(type, userId, currentUserId) {
  const indexUser = users.findIndex((user) => user.id === userId);

  if (type === "remove") {
    users[indexUser].like--;
  } else {
    users[indexUser].like++;
  }
}

function dislikeUser(type, userId) {
  const indexUser = users.findIndex((user) => user.id === userId);

  if (type === "remove") {
    users[indexUser].dislike--;
  } else {
    users[indexUser].dislike++;
  }
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

module.exports = {
  userJoin,
  findOneUser,
  likeUser,
  dislikeUser,
  userLeave,
  users,
};
