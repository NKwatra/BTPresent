"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.report = void 0;

var _models = require("./repo/models");

var _info = require("./domain/info");

var storeInDb = function storeInDb(present, absent, studentID, univID, year, month) {
  var attendance = present / (present + absent) * 100;

  _models.MonthlyStudentAttendance.create({
    year: year,
    month: month,
    studentID: studentID,
    univID: univID,
    attendance: attendance
  }).then(function () {
    console.log("Record Added");
  })["catch"](function (err) {
    console.log(err);
  });
};

var report = function report() {
  //create a date object to get the current year and month
  var dateToday = new Date();
  var year = dateToday.getFullYear();
  var month = dateToday.getMonth() + 1; //get all the students stored in the db

  _models.Student.find().then(function (students) {
    //for each student get the array of courses
    students.forEach(function (student) {
      // create two variables for each student
      var courses = student.courses;
      var len = courses.length;
      var index = 0;
      var presentDays = 0;
      var absentDays = 0; // for each course take its ID along with the student id 
      //and get the student attendance for that course

      courses.forEach(function (courseID) {
        (0, _info.getPreviousAttendance)(courseID, "STUDENT", student._id).then(function (attendance) {
          //use the returned attendance object to add the present 
          //and absent days for that month to our variables
          presentDays = presentDays + attendance[year][month]["present"].length;
          absentDays = absentDays + attendance[year][month]["absent"].length;
          index++;

          if (index == len) {
            storeInDb(presentDays, absentDays, student._id, student.univID, year, month);
          }
        });
      });
    });
  })["catch"](function (err) {
    console.log(err);
  });
};

exports.report = report;