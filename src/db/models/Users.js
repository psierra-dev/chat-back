const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
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
    required: true,
  },
  dislike: {
    type: [String], // Array de cadenas
    required: true,
  },
  biography: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
