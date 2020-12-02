"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPreviousAttendance = exports.addNewAttendance = exports.getStudentList = exports.getAllCourses = exports.getAllUniversities = void 0;

var _info = require("../repo/info");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var getPreviousAttendance = function getPreviousAttendance(courseID, accountType, userID) {
  var attendanceRecord = {}; //Check for the account type
  //if account type is student

  if (accountType === "STUDENT") {
    //fetch the days student was present
    return (0, _info.getStudentAttendanceFromDB)(courseID, userID).then(function (presentDays) {
      //after successfully getting the present record fetch the days student was absent
      return (0, _info.getAbsentRecordFromDB)(courseID, userID).then(function (absentDays) {
        presentDays.forEach(function (day) {
          //Extract the year and month for each date the student was present
          var year = day.lectureDate.getFullYear(); //Month is indexed with 0 i.e. January = 0, adding 1 to start indexing from 1

          var month = day.lectureDate.getMonth() + 1;

          if (attendanceRecord.hasOwnProperty(year)) {
            if (attendanceRecord[year].hasOwnProperty(month)) {
              attendanceRecord[year][month]["present"].push(day.lectureDate.getDate());
            } else {
              attendanceRecord[year][month] = {
                present: [day.lectureDate.getDate()],
                absent: []
              };
            }
          } else {
            attendanceRecord[year] = _defineProperty({}, month, {
              present: [day.lectureDate.getDate()],
              absent: []
            });
          }
        }); //Enter the dates for which the student was absent in the object to be returned

        absentDays.forEach(function (day) {
          var year = day.lectureDate.getFullYear();
          var month = day.lectureDate.getMonth() + 1;

          if (attendanceRecord.hasOwnProperty(year)) {
            if (attendanceRecord[year].hasOwnProperty(month)) {
              attendanceRecord[year][month]["absent"].push(day.lectureDate.getDate());
            } else {
              attendanceRecord[year][month] = {
                present: [],
                absent: [day.lectureDate.getDate()]
              };
            }
          } else {
            attendanceRecord[year] = _defineProperty({}, month, {
              present: [],
              absent: [day.lectureDate.getDate()]
            });
          }
        });
        return attendanceRecord;
      })["catch"](function (err) {
        console.log("Error in second student function " + err);
      });
    })["catch"](function (err) {
      console.log("Error in first student function " + err);
    });
  } //if account type is teacher
  else {
      //fetch the days for which teacher took the lecture
      return (0, _info.getTeacherAttendanceFromDB)(courseID, userID).then(function (attendance) {
        attendance.forEach(function (day) {
          var year = day.lectureDate.getFullYear();
          var month = day.lectureDate.getMonth() + 1;

          if (attendanceRecord.hasOwnProperty(year)) {
            if (attendanceRecord[year].hasOwnProperty(month)) {
              attendanceRecord[year][month]["present"].push(day.lectureDate.getDate());
            } else {
              attendanceRecord[year][month] = {
                present: [day.lectureDate.getDate()]
              };
            }
          } else {
            attendanceRecord[year] = _defineProperty({}, month, {
              present: [day.lectureDate.getDate()]
            });
          }
        });
        return attendanceRecord;
      })["catch"](function (err) {
        console.log("Error in teacher function " + err);
      });
    }
};

exports.getPreviousAttendance = getPreviousAttendance;