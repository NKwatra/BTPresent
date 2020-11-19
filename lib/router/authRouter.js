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
  (0, _auth.login)(req.user).then(function (response) {
    return res.json(response);
  });
}); // '/auth/signup' -> match

router.post("/signup", function (req, res) {
  // extract user data
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
      courses = _req$body.courses; // register user into the db

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
    res.json(resp); // API token is returned
  });
}); // '/auth/check' -> match

router.post("/check", _passport["default"].authenticate("jwt", {
  session: false
}), function (req, res) {
  // if not reached here, passport automatically tells that
  // unauthenticated
  res.json(true); // tell user that he/she is authenticated
});
var _default = router;
exports["default"] = _default;