//const User = require("../db/models/Users");

class UserService {
  db;
  constructor(db) {
    this.db = db;
  }

  async createOrUpdate(data, type) {
    console.log(type, type);
    if (type === "update") {
      const user = await this.updateStatu(data.userId, true);
      console.log(user, "user-update");
    }
    if (type === "create") {
      await this.create(data);
    }
  }

  async updateStatu(userId, statu) {
    console.log(userId);
    try {
      const user = await this.db.User.findOneAndUpdate(
        {userId: userId},
        {online: statu},
        {new: true, runValidators: true}
      );
      return user;
    } catch (error) {}
  }

  async create(data) {
    console.log(data);
    const userCreated = await this.findOne({
      $or: [{username: data.username}, {userId: data.userId}],
    });
    console.log(userCreated);
    if (userCreated) return;
    const user = new this.db.User(data);
    await user.save();
    return user;
  }

  async addOrRemoveLike(fromId, toId) {
    const userTo = await this.findOne({id: toId});

    const isLike = userTo.like.includes(fromId);
    const isDisLike = userTo.dislike.includes(fromId);

    let user;
    if (!isLike) {
      if (isDisLike) {
        await this.db.User.findOneAndUpdate(
          {id: toId},
          {$pull: {dislike: fromId}},
          {new: true, runValidators: true}
        );
      }
      user = await this.db.User.findOneAndUpdate(
        {id: toId},
        {$push: {like: fromId}},
        {new: true, runValidators: true}
      );
    } else {
      user = await this.db.User.findOneAndUpdate(
        {id: toId},
        {$pull: {like: fromId}},
        {new: true, runValidators: true}
      );
    }
    return user;
  }
  async addOrRemoveDisLike(fromId, toId) {
    const userTo = await this.findOne({id: toId});

    const isLike = userTo.like.includes(fromId);
    const isDisLike = userTo.dislike.includes(fromId);

    let user;
    if (!isDisLike) {
      if (isLike) {
        await this.db.User.findOneAndUpdate(
          {id: toId},
          {$pull: {like: fromId}},
          {new: true, runValidators: true}
        );
      }
      user = await this.db.User.findOneAndUpdate(
        {id: toId},
        {$push: {dislike: fromId}},
        {new: true, runValidators: true}
      );
    } else {
      user = await this.db.User.findOneAndUpdate(
        {id: toId},
        {$pull: {dislike: fromId}},
        {new: true, runValidators: true}
      );
    }

    return user;
  }

  async deleteOne(userId) {
    await this.db.User.findOneAndDelete({userId: userId});
  }
  async findOne(condition) {
    const user = await this.db.User.findOne(condition);
    return user;
  }

  async findAll() {
    const users = await this.db.User.find();
    return users;
  }
}

module.exports = UserService;
