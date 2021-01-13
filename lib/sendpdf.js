"use strict";

var mongoose = require("mongoose");

var pdfPrinter = require("pdfmake");

var fs = require("fs-extra");

var Models = require("./repo/models");

var RepoFunction = require("./repo/info");

var MonthlyStudentAttendance = Models.MonthlyStudentAttendance;
var getUniversitiesFromDb = RepoFunction.getUniversitiesFromDb;
mongoose.connect("mongodb://localhost:27017/btpresent", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we're connected!");
  sendpdf();
});

var getAttendance = function getAttendance(universityID, year, month) {
  return MonthlyStudentAttendance.find({
    univID: mongoose.Types.ObjectId(universityID),
    year: year,
    month: month,
    attendance: {
      $lt: 60
    }
  }).populate({
    path: "studentID",
    model: "student"
  }).exec();
};

var buildTableBody = function buildTableBody(data, columns) {
  var body = [];
  body.push(columns);
  data.forEach(function (row) {
    var dataRow = [];
    columns.forEach(function (column) {
      dataRow.push(row[column].toString());
    });
    body.push(dataRow);
  });
  return body;
};

var table = function table(data, columns) {
  return {
    table: {
      headerRows: 1,
      body: buildTableBody(data, columns)
    },
    margin: [130, 25, 10, 10],
    layout: {
      hLineColor: function hLineColor() {
        return 'blue';
      },
      vLineColor: function vLineColor() {
        return 'blue';
      },
      paddingLeft: function paddingLeft() {
        return 15;
      },
      paddingRight: function paddingRight() {
        return 15;
      },
      paddingTop: function paddingTop() {
        return 4;
      },
      paddingBottom: function paddingBottom() {
        return 4;
      }
    }
  };
};

var makeString = function makeString(year, month) {
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var message = 'The following is the list of students with their attendance less than 60% for the month of ' + monthNames[month - 1] + ', ' + year.toString();
  return message;
};

var makepdfs = function makepdfs(attendance, year, month, id) {
  var fonts = {
    Roboto: {
      normal: 'fonts/roboto.regular.ttf',
      bold: 'fonts/roboto.medium.ttf',
      italics: 'fonts/roboto.italic.ttf',
      bolditalics: 'fonts/roboto.medium-italic.ttf'
    }
  };
  var printer = new pdfPrinter(fonts);
  var shortAttendance = attendance.map(function (record) {
    return {
      Name: record.studentID.firstname + " " + record.studentID.lastname,
      Enrollment_Number: record.studentID.enrollmentNumber
    };
  });
  var docDefinition = {
    pageSize: 'A4',
    pageMargins: [50, 50, 50, 50],
    footer: function footer(currentPage, pageCount) {
      return {
        alignment: 'center',
        text: currentPage.toString() + ' of ' + pageCount,
        fontSize: 8,
        margin: [10, 20, 10, 20]
      };
    },
    content: [{
      text: 'Short Attendance Record',
      style: 'header'
    }, {
      text: makeString(year, month),
      style: 'text'
    }, table(shortAttendance, ['Name', 'Enrollment_Number'])],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      text: {
        fontSize: 14
      }
    }
  };
  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream('attendance/' + year + '_' + month + '_' + id + '.pdf'));
  pdfDoc.end();
};

var sendpdf = function sendpdf() {
  var dateToday = new Date();
  var year = dateToday.getFullYear();
  var month = dateToday.getMonth() + 1;
  getUniversitiesFromDb().then(function (universities) {
    universities.forEach(function (university) {
      getAttendance(university._id, year, month).then(function (attendance) {
        makepdfs(attendance, year, month, university._id);
        db.close();
      });
    });
  });
};