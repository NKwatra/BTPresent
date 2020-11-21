"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _info = require("../domain/info");

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
router.post("/extract", function (req, res) {
  var address = req.body.address;
  (0, _info.getStudentList)(address).then(function (students) {
    return res.json(students);
  });
});
router.get("/attendance/add", function (req, res) {
  //const { univID, students, courseID , teacherID } = req.body;
  var univID = "5fb8c56d192a3e4cfd05bc68";
  var courseID = "5fb8c5b2192a3e4cfd05bc69";
  var students = [{
    roll: "201",
    id: "5fb8c809192a3e4cfd05bc6a"
  }];
  var teacherID = "5fb8c8a8192a3e4cfd05bc6b";
  (0, _info.storeAttendance)(univID, students, courseID, teacherID).then(function (response) {
    return res.json({
      saved: response
    });
  });
});
var _default = router;
exports["default"] = _default;