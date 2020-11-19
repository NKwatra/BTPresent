"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _passportJwt = require("passport-jwt");

var _auth = require("../repo/auth");

var _passportLocal = require("passport-local");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var options = {};
options.secretOrKey = process.env.JWT_SECRET; // Authorization: Bearer <token>

options.jwtFromRequest = _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(); // header.payload.signature -> payload => decrypt

function _default(passport) {
  // initialising jwt based requests
  passport.use(new _passportJwt.Strategy(options, function (payload, done) {
    (0, _auth.searchById)(payload.id).then(function (result) {
      if (!result) done(null, false);else done(null, result);
    })["catch"](function (err) {
      return done(err);
    });
  }));
  passport.use(new _passportLocal.Strategy(function (username, password, done) {
    // username$univId$MACaddress
    var _username$split = username.split("$"),
        _username$split2 = _slicedToArray(_username$split, 3),
        trueUsername = _username$split2[0],
        univId = _username$split2[1],
        address = _username$split2[2]; // search for a student or a teacher with given username
    // TODO: update MAC address only if passwords match


    (0, _auth.searchByUsername)(trueUsername, univId, address).then(function (users) {
      // no such user exist
      if (users.length == 0) done(null, false, {
        message: "User does not exist"
      });else {
        // compare password stored in db to sent password
        _bcrypt["default"].compare(password, users[0].password).then(function (result) {
          // passwords match
          if (result) done(null, users[0]); // passwords don't match
          else done(null, false, {
              message: "Incorrect username or password"
            });
        });
      }
    })["catch"](function (err) {
      return done(err);
    }); // error at server
  }));
}