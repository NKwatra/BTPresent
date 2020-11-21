"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addNewAttendance = exports.getStudentList = exports.getAllCourses = exports.getAllUniversities = void 0;

var _info = require("../repo/info");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// extract all universities registered in database
var getAllUniversities = function getAllUniversities() {
  return (0, _info.getUniversitiesFromDb)().then(function (universities) {
    if (universities == null) return [];
    return universities.map(function (university) {
      return {
        id: university._id,
        name: university.name
      };
    });
  });
}; // all courses of a particular univ


exports.getAllUniversities = getAllUniversities;

var getAllCourses = function getAllCourses(university) {
  return (0, _info.getAllCoursesFromDb)(university).then(function (courses) {
    if (courses == null) return [];
    return courses.map(function (course) {
      return {
        id: course._id,
        name: course.courseName
      };
    });
  });
};

exports.getAllCourses = getAllCourses;

var getStudentList = function getStudentList(address) {
  return (0, _info.getStudentListFromDb)(address).then(function (studentList) {
    if (studentList == null || studentList.length == 0) return [];else {
      var students = {
        universityID: studentList[0].univID
      };
      students.studentPresent = studentList.map(function (student) {
        return {
          name: student.firstname + " " + student.lastname,
          roll: student.enrollmentNumber,
          id: student._id
        };
      });
      return students;
    }
  });
};

exports.getStudentList = getStudentList;

var addNewAttendance = function addNewAttendance(univID, students, courseID, teacherID) {
  var studenstWithoutId = students.filter(function (student) {
    return !student.hasOwnProperty("id");
  }).map(function (student) {
    return student.roll;
  });
  var studentsWithID = students.filter(function (student) {
    return student.hasOwnProperty("id");
  }).map(function (student) {
    return student.id;
  });
  var studentAttendancePromise = (0, _info.extractStudentID)(univID, studenstWithoutId).then(function (students) {
    var ids = students.map(function (student) {
      return student._id;
    });
    console.log(ids, studentsWithID);
    return (0, _info.insertStudentAttendance)([].concat(_toConsumableArray(ids), _toConsumableArray(studentsWithID)), courseID).then(function (res) {
      return res;
    });
  });
  var classRecordPromise = (0, _info.insertClassRecord)(teacherID, courseID);
  return Promise.all([studentAttendancePromise, classRecordPromise]).then(function () {
    return true;
  })["catch"](function () {
    return false;
  });
};

exports.addNewAttendance = addNewAttendance;