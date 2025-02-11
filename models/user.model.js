const validator = require('validator');
const mongoose = require('mongoose');
const userRoles = require('../utils/userRoles');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  token: {
    type: String
  },
  role: {
    type: String,
    enum: [userRoles.MANAGER, userRoles.ADMIN, userRoles.USER],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
});

module.exports = mongoose.model("User", userSchema);