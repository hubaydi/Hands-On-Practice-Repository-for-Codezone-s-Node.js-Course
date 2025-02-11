const appError = require('../utils/appError');
const { FAIL } = require('../utils/httpStatusText');

module.exports = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    const error = appError.create(`${req.user.role}: You are not allowed to perform this action`, 403, FAIL);
    return next(error);
  }
  next();
};