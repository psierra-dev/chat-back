let users = [];

function userJoin(id, username) {
  users.push({ id, username });
}

function findOneUser(id) {
  return users.find((u) => u.id === id);
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
  userLeave,
  users,
};
