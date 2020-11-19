"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginMiddleware = exports.login = exports.signUp = void 0;

var _auth = require("../repo/auth");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _passport = _interopRequireDefault(require("passport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var signUp = function signUp(_ref) {
  var accountType = _ref.accountType,
      fName = _ref.fName,
      lName = _ref.lName,
      password = _ref.password,
      university = _ref.university,
      email = _ref.email,
      altEmail = _ref.altEmail,
      enrollNo = _ref.enrollNo,
      macAddress = _ref.macAddress,
      courses = _ref.courses;
  return _bcrypt["default"].hash(password, 10).then(function (hash) {
    password = hash; // set hash as password
    // store promise

    var signUpPromise = accountType === "STUDENT" ? (0, _auth.signUpStudent)({
      fName: fName,
      lName: lName,
      password: password,
      university: university,
      email: email,
      altEmail: altEmail,
      enrollNo: enrollNo,
      macAddress: macAddress,
      courses: courses
    }) : (0, _auth.signUpTeacher)({
      fName: fName,
      lName: lName,
      password: password,
      university: university,
      courses: courses,
      email: email
    });
    return signUpPromise.then(function (response) {
      if (response === null) // if signup failed somehow
        return {
          message: "There was some error, please try again later"
        }; // create jwt token from id, 15 min expiration

      var token = _jsonwebtoken["default"].sign(response, process.env.JWT_SECRET, {
        expiresIn: 15 * 60
      });

      return {
        token: token
      }; // {'token': token}
    });
  });
};
/*
    Function to send user an API token and courses of user
    on successful login
*/


exports.signUp = signUp;

var login = function login(user) {
  var token = _jsonwebtoken["default"].sign({
    id: user._id
  }, process.env.JWT_SECRET, {
    expiresIn: 15 * 60
  });

  return user.populate("courses", "courseName _id").execPopulate().then(function () {
    return {
      selectedCourses: user.courses,
      token: token
    };
  });
};
/* 
    Middleware to send customised message in case
    of login failure to user
*/


exports.login = login;

var loginMiddleware = function loginMiddleware(req, res, next) {
  _passport["default"].authenticate("local", function (err, user, info) {
    if (err) return next(err);

    if (!user) {
      res.status(401).json({
        message: info.message
      }).end();
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

exports.loginMiddleware = loginMiddleware;