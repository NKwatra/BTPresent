"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUpTeacher = exports.signUpStudent = void 0;

var _models = require("./models");

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
      universityId: student.univID,
      enrollmentNo: student.enrollmentNumber
    };
  })["catch"](function (err) {
    return null;
  });
};

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
      universityId: teacher.univID,
      id: teacher._id
    };
  })["catch"](function (err) {
    return null;
  });
};

exports.signUpTeacher = signUpTeacher;