"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeTeacherAttendanceInDB = exports.storeStudentAttendanceInDB = exports.getStudentIDFromDB = exports.getStudentListFromDb = exports.getAllCoursesFromDb = exports.getUniversitiesFromDb = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _models = require("./models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getUniversitiesFromDb = function getUniversitiesFromDb() {
  return _models.University.find({}).then(function (universities) {
    return universities;
  })["catch"](function (err) {
    return null;
  });
};

exports.getUniversitiesFromDb = getUniversitiesFromDb;

var getAllCoursesFromDb = function getAllCoursesFromDb(university) {
  return _models.Course.find({
    univId: _mongoose["default"].Types.ObjectId(university)
  }).then(function (courses) {
    return courses;
  })["catch"](function (err) {
    console.log(err);
    return null;
  });
};

exports.getAllCoursesFromDb = getAllCoursesFromDb;

var getStudentListFromDb = function getStudentListFromDb(address) {
  return _models.Student.find({
    MACaddress: {
      $in: address
    }
  }).then(function (studentList) {
    return studentList;
  })["catch"](function (err) {
    return null;
  });
};

exports.getStudentListFromDb = getStudentListFromDb;

var getStudentIDFromDB = function getStudentIDFromDB(univID, roll) {
  var foundStudents = _models.Student.find({
    univID: _mongoose["default"].Types.ObjectId(univID),
    enrollmentNumber: {
      $in: roll
    }
  }).then(function (students) {
    return students;
  });

  return foundStudents;
};

exports.getStudentIDFromDB = getStudentIDFromDB;

var storeStudentAttendanceInDB = function storeStudentAttendanceInDB(courseID, studentID) {
  return _models.StudentAttendance.create({
    course: courseID,
    studentID: studentID
  });
};

exports.storeStudentAttendanceInDB = storeStudentAttendanceInDB;

var storeTeacherAttendanceInDB = function storeTeacherAttendanceInDB(courseID, teacherID) {
  return _models.TeacherAttendance.create({
    course: courseID,
    teacherID: teacherID
  });
};

exports.storeTeacherAttendanceInDB = storeTeacherAttendanceInDB;