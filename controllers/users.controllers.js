const User = require('../models/user.model');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/generateJWT');

const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({}, { __v: false, password: false });
  res.status(200).json({ status: SUCCESS, data: { users } });
});

const createUser = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    const error = appError.create('User already exists', 400, FAIL);
    return next(error);
  };
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = new User({
    firstName, 
    lastName, 
    email, 
    password: hashedPassword, 
    role,
    avatar: req.file.filename
  });
  // generate JWT token
  const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role });
  newUser.token = token;

  await newUser.save();

  const userObject = newUser.toObject();
  delete userObject.password;
  delete userObject.__v;

  return res.status(201).json({ status: SUCCESS, data: { user: userObject } });
});

const loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = appError.create('Please provide email and password', 400, FAIL);
    return next(error);
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = appError.create('User with this email does not exist', 404, FAIL);
    return next(error);
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    const error = appError.create('Incorrect password', 401, FAIL);
    return next(error);
  } 
  const token = await generateJWT({ email: user.email, id: user._id, role: user.role });
  return res.status(200).json({ status: SUCCESS, data: { token } });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    const error = appError.create('User not found', 404, FAIL);
    return next(error);
  };

  const userObject = deletedUser.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.token;

  return res.status(200).json({ status: SUCCESS, data: { deletedUser: userObject } });
});

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  deleteUser
};