"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeAttendance = exports.getStudentList = exports.getAllCourses = exports.getAllUniversities = void 0;

var _info = require("../repo/info");

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
          rollNo: student.enrollmentNumber,
          id: student._id
        };
      });
      return students;
    }
  });
};

exports.getStudentList = getStudentList;

var storeAttendance = function storeAttendance(univID, students, courseID, teacherID) {
  var roll = students.map(function (student) {
    return student.roll;
  });
  return (0, _info.getStudentIDFromDB)(univID, roll).then(function (Foundstudents) {
    var studentID = [];
    Foundstudents.forEach(function (student) {
      console.log(student._id);
      studentID.push(student._id);
    });
    return (0, _info.storeStudentAttendanceInDB)(courseID, studentID);
  }).then(function (resp) {
    console.log("First input Successful " + resp);
    return (0, _info.storeTeacherAttendanceInDB)(courseID, teacherID);
  }).then(function (resp) {
    console.log("Second input Successful " + resp);
    return true;
  })["catch"](function (err) {
    console.log(err);
    return false;
  });
};

exports.storeAttendance = storeAttendance;