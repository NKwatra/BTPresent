"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.report = void 0;

var mongoose = require("mongoose");

var DomainFunction = require("./domain/info");

var Models = require("./repo/models");

var getPreviousAttendance = DomainFunction.getPreviousAttendance;
var Student = Models.Student;
var MonthlyStudentAttendance = Models.MonthlyStudentAttendance; // mongoose.connect(process.env.CLUSTER_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("we're connected!");
//   report();
// });

var storeInDb = function storeInDb(present, absent, studentID, univID, year, month, studentIndex, numberOfStudents) {
  var attendance;

  if (isNaN(present / (present + absent)) * 100) {
    attendance = 0.0;
  } else {
    attendance = present / (present + absent) * 100;
  }

  MonthlyStudentAttendance.create({
    year: year,
    month: month,
    studentID: studentID,
    univID: univID,
    attendance: attendance
  }).then(function () {
    console.log("Record Added"); // if (studentIndex == numberOfStudents) db.close();
  })["catch"](function (err) {
    console.log(err);
  });
};

var report = function report() {
  //create a date object to get the current year and month
  var dateToday = new Date();
  var year = dateToday.getFullYear();
  var month = dateToday.getMonth() + 1; //get all the students stored in the db

  return Student.find().then(function (students) {
    //for each student get the array of courses
    var numberOfStudents = students.length;
    var studentIndex = 0;
    students.forEach(function (student) {
      // create two variables for each student
      studentIndex++;
      var courses = student.courses;
      var numberOfCourses = courses.length;
      var courseIndex = 0;
      var presentDays = 0;
      var absentDays = 0; // for each course take its ID along with the student id
      //and get the student attendance for that course

      courses.forEach(function (courseID) {
        getPreviousAttendance(courseID, "STUDENT", student._id).then(function (attendance) {
          //use the returned attendance object to add the present
          //and absent days for that month to our variables
          presentDays += attendance[year] && attendance[year][month] ? attendance[year][month]["present"].length : 0;
          absentDays += attendance[year] && attendance[year][month] ? attendance[year][month]["absent"].length : 0;
          courseIndex++;

          if (courseIndex == numberOfCourses) {
            storeInDb(presentDays, absentDays, student._id, student.univID, year, month, studentIndex, numberOfStudents);
          }
        });
      });
    });
  })["catch"](function (err) {
    console.log(err);
  });
};

exports.report = report;