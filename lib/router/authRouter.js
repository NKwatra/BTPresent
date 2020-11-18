"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = require("../domain/auth");

var _passport = _interopRequireDefault(require("passport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();
router.post("/login", _auth.loginMiddleware, function (req, res) {
  console.log(req.user);
  (0, _auth.login)(req.user).then(function (response) {
    return res.json(response);
  });
});
router.post("/signup", function (req, res) {
  var _req$body = req.body,
      accountType = _req$body.accountType,
      fName = _req$body.fName,
      lName = _req$body.lName,
      password = _req$body.password,
      university = _req$body.university,
      email = _req$body.email,
      altEmail = _req$body.altEmail,
      enrollNo = _req$body.enrollNo,
      macAddress = _req$body.macAddress,
      courses = _req$body.courses;
  (0, _auth.signUp)({
    accountType: accountType,
    fName: fName,
    lName: lName,
    password: password,
    university: university,
    email: email,
    altEmail: altEmail,
    enrollNo: enrollNo,
    macAddress: macAddress,
    courses: courses
  }).then(function (resp) {
    res.json(resp);
  });
});
router.post("/check", _passport["default"].authenticate("jwt", {
  session: false
}), function (req, res) {
  res.json(true);
});
var _default = router;
exports["default"] = _default;