const Course = require('../models/course.model');
const { validationResult } = require('express-validator');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

const getAllCourses = asyncWrapper(async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  let skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.status(200).json({ status: SUCCESS, data: { courses } });
});

const getCourseById = asyncWrapper(async (req, res, next) => {

  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create('Course not found', 404, FAIL);
    return next(error);
  }
  return res.status(200).json({ status: SUCCESS, data: { course } });

});

const createCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, FAIL);
    return next(error);
  }

  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ status: SUCCESS, data: { course: newCourse } });
});
  
const updateCourse = asyncWrapper(async (req, res, next) => {
  const { courseId } = req.params;
  const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, { new: true });

  if (!updatedCourse) {
    const error = appError.create('Course not found', 404, FAIL);
    return next(error);
  };
  return res.status(200).json({ status: SUCCESS, data: { course: updatedCourse } });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const { courseId } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      const error = appError.create('Course not found', 404, FAIL);
      return next(error);
    }
    return res.status(200).json({ status: SUCCESS, data: { deletedCourse } });
});

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
}