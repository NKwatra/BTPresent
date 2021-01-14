"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _info = require("../domain/info");

var _passport = _interopRequireDefault(require("passport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)(); // '/info/universities' -> match

router.get("/universities", function (req, res) {
  // list of all registered univs and return it
  (0, _info.getAllUniversities)().then(function (universities) {
    return res.json(universities);
  });
}); // all courses of a particular university

router.get("/courses/:university", function (req, res) {
  var university = req.params.university;
  (0, _info.getAllCourses)(university).then(function (courses) {
    return res.json(courses);
  });
});
router.post("/extract", _passport["default"].authenticate("jwt", {
  session: false
}), function (req, res) {
  var address = req.body.address;
  (0, _info.getStudentList)(address).then(function (students) {
    return res.json(students);
  });
});
router.post("/attendance/add", _passport["default"].authenticate("jwt", {
  session: false
}), function (req, res) {
  var _req$body = req.body,
      univID = _req$body.univID,
      students = _req$body.students,
      courseID = _req$body.courseID;
  var id = req.user._id;
  (0, _info.addNewAttendance)(univID, students, courseID, id).then(function (saved) {
    return res.json({
      saved: saved
    });
  });
});
router.get("/attendance", _passport["default"].authenticate("jwt", {
  session: false
}), function (req, res) {
  var _req$query = req.query,
      courseID = _req$query.courseID,
      accountType = _req$query.accountType;
  var userID = req.user._id;
  (0, _info.getPreviousAttendance)(courseID, accountType, userID).then(function (previousAttendance) {
    res.json(previousAttendance);
  });
});
router.get("/attendance/get", _passport["default"].authenticate("jwt", {
  session: false
}), function (req, res) {
  var _req$query2 = req.query,
      courseID = _req$query2.courseID,
      year = _req$query2.year,
      month = _req$query2.month,
      day = _req$query2.day;
  (0, _info.extractAttendance)(courseID, year, month, day).then(function (attendance) {
    return res.json(attendance);
  });
});
router.post("/attendance/update", _passport["default"].authenticate("jwt", {
  session: false
}), function (req, res) {
  var _req$body2 = req.body,
      studentIdList = _req$body2.studentIdList,
      studentRollList = _req$body2.studentRollList,
      courseID = _req$body2.courseID,
      year = _req$body2.year,
      month = _req$body2.month,
      day = _req$body2.day;
  var univID = req.user.univID;
  (0, _info.updateStudentAttendance)(studentIdList, studentRollList, courseID, univID, year, month, day).then(function (saved) {
    return res.json(saved);
  });
});
var _default = router;
exports["default"] = _default;