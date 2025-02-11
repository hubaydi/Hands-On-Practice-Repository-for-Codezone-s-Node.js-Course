let express = require('express');
let router = express.Router();
const validationSchema = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');

let {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses.controllers');
const userRoles = require('../utils/userRoles');

// CRUD operations: Create, Read, Update, Delete

router.route('/')
  .get(verifyToken, getAllCourses)
  .post(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), validationSchema(), createCourse);

router.route('/:courseId')
  .get(verifyToken, getCourseById)
  .patch(verifyToken, allowedTo(userRoles.MANAGER), updateCourse)
  .delete(verifyToken, allowedTo(userRoles.MANAGER), deleteCourse);

module.exports = router;
