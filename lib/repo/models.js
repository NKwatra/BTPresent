"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TeacherAttendance = exports.StudentAttendance = exports.Teacher = exports.Student = exports.Course = exports.University = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var universitySchema = new _mongoose["default"].Schema({
  name: String
});
var courseSchema = new _mongoose["default"].Schema({
  courseName: String,
  univID: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "university"
  }
});
var teacherSchema = new _mongoose["default"].Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  courses: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "course"
  }],
  univID: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "university"
  }
});
var studentSchema = new _mongoose["default"].Schema({
  firstname: String,
  lastname: String,
  email: String,
  alternateEmail: String,
  enrollmentNumber: String,
  MACaddress: String,
  password: String,
  courses: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "course"
  }],
  univID: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "university"
  }
});
var studentAttendanceSchema = new _mongoose["default"].Schema({
  lectureDate: {
    type: Date,
    "default": Date.now
  },
  course: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "course"
  },
  studentID: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "student"
  }]
});
var teacherAttendanceSchema = new _mongoose["default"].Schema({
  lectureDate: {
    type: Date,
    "default": Date.now
  },
  course: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "course"
  },
  teacherID: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "teacher"
  }
});

var University = _mongoose["default"].model("university", universitySchema);

exports.University = University;

var Course = _mongoose["default"].model("course", courseSchema);

exports.Course = Course;

var Student = _mongoose["default"].model("student", studentSchema);

exports.Student = Student;

var Teacher = _mongoose["default"].model("teacher", teacherSchema);

exports.Teacher = Teacher;

var StudentAttendance = _mongoose["default"].model("studentAttendance", studentAttendanceSchema);

exports.StudentAttendance = StudentAttendance;

var TeacherAttendance = _mongoose["default"].model("teacherAttendance", teacherAttendanceSchema);

exports.TeacherAttendance = TeacherAttendance;