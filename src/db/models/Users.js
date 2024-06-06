const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  interests: {
    type: [String], // Array de cadenas
    required: true,
  },
  like: {
    type: [String], // Array de cadenas
  },
  dislike: {
    type: [String], // Array de cadenas
  },
  biography: {
    type: String,
  },
  online: {
    type: Boolean,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
