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
router.get("/extract", function (req, res) {
  //const { address } = req.body;
  var address = ["29ap98"];
  (0, _info.getStudentList)(address).then(function (students) {
    console.log(students);
    res.json(students);
  });
});
var _default = router;
exports["default"] = _default;