let express = require('express');
let router = express.Router();
const path = require('node:path');
const appError = require('../utils/appError');

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const uniqueSuffix = `user-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`
    cb(null, uniqueSuffix)
  }
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0] === 'image';

  if (imageType) {
    return cb(null, true);
  } else {
    return cb(appError.create('Only image files are allowed', 400, 'FAIL'), false);
  }
}

const upload = multer({ storage: storage, fileFilter })

const {
  getAllUsers,
  createUser,
  loginUser,
  deleteUser
} = require('../controllers/users.controllers');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const userRoles = require('../utils/userRoles');

// Get all users
router.route('/')
  .get(verifyToken, allowedTo(userRoles.MANAGER), getAllUsers);

// Register a new user
router.route('/register')
  .post(upload.single('avatar'), createUser);

// Login a user
router.route('/login')
  .post(loginUser);

// Delete a user
router.route('/:userId')
  .delete(verifyToken, allowedTo(userRoles.MANAGER), deleteUser);
module.exports = router;
