"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchByUsername = exports.searchById = exports.signUpTeacher = exports.signUpStudent = void 0;

var _models = require("./models");

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// function to add new student to database
var signUpStudent = function signUpStudent(_ref) {
  var fName = _ref.fName,
      lName = _ref.lName,
      email = _ref.email,
      altEmail = _ref.altEmail,
      enrollNo = _ref.enrollNo,
      university = _ref.university,
      macAddress = _ref.macAddress,
      password = _ref.password,
      courses = _ref.courses;
  return _models.Student.create({
    firstname: fName,
    lastname: lName,
    email: email,
    alternateEmail: altEmail,
    enrollmentNumber: enrollNo,
    MACaddress: macAddress,
    password: password,
    univID: university,
    courses: courses
  }).then(function (student) {
    return {
      id: student._id
    };
  })["catch"](function (err) {
    return null;
  });
}; // function to add new teacher to db


exports.signUpStudent = signUpStudent;

var signUpTeacher = function signUpTeacher(_ref2) {
  var fName = _ref2.fName,
      lName = _ref2.lName,
      email = _ref2.email,
      university = _ref2.university,
      password = _ref2.password,
      courses = _ref2.courses;
  return _models.Teacher.create({
    firstname: fName,
    lastName: lName,
    email: email,
    password: password,
    courses: courses,
    univID: university
  }).then(function (teacher) {
    return {
      id: teacher._id
    };
  })["catch"](function (err) {
    return null;
  });
}; // function to search by a unique id and then return user


exports.signUpTeacher = signUpTeacher;

var searchById = function searchById(id) {
  var searchStudent = _models.Student.findById(id).then(function (student) {
    return student;
  })["catch"](function () {
    return null;
  });

  var searchTeacher = _models.Teacher.findById(id).then(function (teacher) {
    return teacher;
  })["catch"](function () {
    return null;
  });

  return Promise.all([searchStudent, searchTeacher]).then(function (results) {
    if (results[0] == null && results[1] == null) return null;
    return results[0] || results[1];
  });
};

exports.searchById = searchById;

var searchByUsername = function searchByUsername(username, university, address) {
  var searchStudent = _models.Student.find({
    enrollmentNumber: username,
    univID: _mongoose["default"].Types.ObjectId(university)
  }).then(function (student) {
    return student;
  })["catch"](function () {
    return null;
  });

  var searchTeacher = _models.Teacher.find({
    email: username,
    univID: _mongoose["default"].Types.ObjectId(university)
  }).then(function (teacher) {
    return teacher;
  })["catch"](function () {
    return null;
  });

  return Promise.all([searchStudent, searchTeacher]).then(function (results) {
    if (results[0].length == 0 && results[1].length == 0) return [];
    /*
      If it is a student user, update it's MAC address in database 
    */

    if (results[0].length > 0) {
      _models.Student.findByIdAndUpdate(results[0][0]._id, {
        MACaddress: address
      }).exec();

      return results[0];
    }

    return results[1];
  });
};

exports.searchByUsername = searchByUsername;