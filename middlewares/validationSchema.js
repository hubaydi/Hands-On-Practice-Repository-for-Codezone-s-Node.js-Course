let { body } = require('express-validator');

const validationSchema = () => {
  return [
    body('name')
      .isLength({ min: 3 })
      .withMessage('Name is required and should be at least 3 characters'),
    body('price')
      .isNumeric()
      .isLength({ min: 3 })
      .withMessage('Price is required and should be a number with at least 3 digits'),
  ];
};


module.exports = validationSchema;