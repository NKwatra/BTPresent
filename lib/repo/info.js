"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractAttendanceFromDb = exports.getTeacherAttendanceFromDB = exports.getAbsentRecordFromDB = exports.getStudentAttendanceFromDB = exports.insertClassRecord = exports.insertStudentAttendance = exports.extractStudentID = exports.getStudentListFromDb = exports.getAllCoursesFromDb = exports.getUniversitiesFromDb = void 0;

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

var extractStudentID = function extractStudentID(univID, enrollments) {
  return _models.Student.find({
    univID: _mongoose["default"].Types.ObjectId(univID),
    enrollmentNumber: {
      $in: enrollments
    }
  }).exec();
};

exports.extractStudentID = extractStudentID;

var insertStudentAttendance = function insertStudentAttendance(ids, courseId) {
  return _models.StudentAttendance.create({
    course: courseId,
    studentID: ids
  }).then(function () {
    return true;
  });
};

exports.insertStudentAttendance = insertStudentAttendance;

var insertClassRecord = function insertClassRecord(teacherID, course) {
  return _models.TeacherAttendance.create({
    teacherID: teacherID,
    course: course
  }).then(function () {
    return true;
  });
};

exports.insertClassRecord = insertClassRecord;

var getStudentAttendanceFromDB = function getStudentAttendanceFromDB(courseID, studentID) {
  return _models.StudentAttendance.find({
    course: _mongoose["default"].Types.ObjectId(courseID),
    studentID: _mongoose["default"].Types.ObjectId(studentID)
  }).then(function (presentDays) {
    return presentDays;
  });
};

exports.getStudentAttendanceFromDB = getStudentAttendanceFromDB;

var getAbsentRecordFromDB = function getAbsentRecordFromDB(courseID, studentID) {
  return _models.StudentAttendance.find({
    course: _mongoose["default"].Types.ObjectId(courseID),
    studentID: {
      $nin: [_mongoose["default"].Types.ObjectId(studentID)]
    }
  }).then(function (absentDays) {
    return absentDays;
  });
};

exports.getAbsentRecordFromDB = getAbsentRecordFromDB;

var getTeacherAttendanceFromDB = function getTeacherAttendanceFromDB(courseID, teacherID) {
  return _models.TeacherAttendance.find({
    course: _mongoose["default"].Types.ObjectId(courseID),
    teacherID: _mongoose["default"].Types.ObjectId(teacherID)
  }).then(function (attendance) {
    return attendance;
  });
};

exports.getTeacherAttendanceFromDB = getTeacherAttendanceFromDB;

var extractAttendanceFromDb = function extractAttendanceFromDb(courseID, currentDate, nextDate) {
  return _models.StudentAttendance.find({
    course: _mongoose["default"].Types.ObjectId(courseID),
    lectureDate: {
      $gt: currentDate,
      $lt: nextDate
    }
  }).exec();
};

exports.extractAttendanceFromDb = extractAttendanceFromDb;