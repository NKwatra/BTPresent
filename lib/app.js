"use strict";

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _passport = _interopRequireDefault(require("passport"));

var _passportStrategies = _interopRequireDefault(require("./domain/passportStrategies"));

var _authRouter = _interopRequireDefault(require("./router/authRouter"));

var _infoRouter = _interopRequireDefault(require("./router/infoRouter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_bodyParser["default"].json());
app.use(_passport["default"].initialize());
app.use("/auth", _authRouter["default"]);
app.use("/info", _infoRouter["default"]);
(0, _passportStrategies["default"])(_passport["default"]);
var PORT = process.env.PORT || 3000;

_mongoose["default"].connect("mongodb://localhost:27017/btpresent", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

var db = _mongoose["default"].connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we're connected!");
});
app.listen(PORT, function () {
  console.log("server has started");
});