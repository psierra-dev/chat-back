const User = require("../db/models/Users");

class UserService {
  constructor() {}

  async create(data) {
    const user = new User(data);
    await user.save();
    return user;
  }

  async addOrRemoveLike(fromId, toId) {
    const userTo = await this.findOne({ id: toId });

    const isLike = userTo.like.includes(fromId);
    const isDisLike = userTo.dislike.includes(fromId);

    let user;
    if (!isLike) {
      if (isDisLike) {
        await User.findOneAndUpdate(
          { id: toId },
          { $pull: { dislike: fromId } },
          { new: true, runValidators: true }
        );
      }
      user = await User.findOneAndUpdate(
        { id: toId },
        { $push: { like: fromId } },
        { new: true, runValidators: true }
      );
    } else {
      user = await User.findOneAndUpdate(
        { id: toId },
        { $pull: { like: fromId } },
        { new: true, runValidators: true }
      );
    }
    return user;
  }
  async addOrRemoveDisLike(fromId, toId) {
    const userTo = await this.findOne({ id: toId });

    const isLike = userTo.like.includes(fromId);
    const isDisLike = userTo.dislike.includes(fromId);

    let user;
    if (!isDisLike) {
      if (isLike) {
        await User.findOneAndUpdate(
          { id: toId },
          { $pull: { like: fromId } },
          { new: true, runValidators: true }
        );
      }
      user = await User.findOneAndUpdate(
        { id: toId },
        { $push: { dislike: fromId } },
        { new: true, runValidators: true }
      );
    } else {
      user = await User.findOneAndUpdate(
        { id: toId },
        { $pull: { dislike: fromId } },
        { new: true, runValidators: true }
      );
    }

    return user;
  }

  async deleteOne(userId) {
    await User.findOneAndDelete({ id: userId });
  }
  async findOne(condition) {
    const user = await User.findOne(condition);
    return user;
  }

  async findAll() {
    const users = await User.find();
    return users;
  }
}

module.exports = UserService;
