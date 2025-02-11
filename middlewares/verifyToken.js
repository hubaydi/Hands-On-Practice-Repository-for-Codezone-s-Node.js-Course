const { FAIL } = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const error = appError.create('Access token is required', 401, FAIL);
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    const error = appError.create(err.message, 401, FAIL);
    return next(error);
  }
}

module.exports = verifyToken