// Description: This file is used to wrap the controller functions
// in a try-catch block to handle the errors in a better way.

module.exports = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
