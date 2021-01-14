"use strict";

var sendGrid = require("@sendgrid/mail");

var fs = require("fs");

var path = require("path");

var mongoose = require("mongoose");

var _require = require("./domain/info"),
    getAllUniversities = _require.getAllUniversities;

var _require2 = require("./repo/models"),
    Student = _require2.Student;

var _require3 = require("./report"),
    report = _require3.report;

var _require4 = require("./sendpdf"),
    sendpdf = _require4.sendpdf;

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

var readPdf = function readPdf(path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, function (err, data) {
      if (err) reject(err);
      resolve(data.toString("base64"));
    });
  });
};

var db = mongoose.connection;
db.on("error", function (err) {
  return console.log("Failed with error ", err);
});
db.once("open", function () {
  // console.log(sendPdf);
  report().then(function () {
    return sendpdf();
  }).then(function () {
    getAllUniversities().then(function (universities) {
      var promises = [];

      if (universities.length > 0) {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth();
        var id;

        for (var i = 0; i < universities.length; i++) {
          id = universities[i].id;
          promises.push(sendEmails(id, year, month, universities[i].name));
        }
      }

      Promise.all(promises).then(function (results) {
        console.log("all resolved", results);
        db.close();
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  });
});

var sendEmails = function sendEmails(id, year, month, name, isLast) {
  return Student.find({
    univID: mongoose.Types.ObjectId(id)
  }).then(function (students) {
    if (students.length > 0) {
      readPdf(path.resolve(__dirname, "../attendance/".concat(monthNames[month], "_").concat(year, "_").concat(id, ".pdf"))).then(function (data) {
        console.log("file read");
        var msg = {
          to: students.map(function (student) {
            return student.email;
          }),
          from: "kwatranishkarsh@gmail.com",
          subject: "Short attendance list for ".concat(monthNames[month], " ").concat(year),
          html: "Dear Student, <br /> <br />\n              Please Find Attached the short attendance list for ".concat(monthNames[month], ". <br />\n            Please take care of your attendance to avoid getting detained if you have short attendance."),
          attachments: [{
            content: data,
            type: "application/pdf",
            contentId: "attendance",
            filename: "Attendance ".concat(monthNames[month], " ").concat(year, " ").concat(name, ".pdf")
          }]
        };
        console.log("sending email to ", id);
        sendGrid.send(msg).then(function () {
          console.log("successfull sent mail");
        })["catch"](function (err) {
          return console.log(err);
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    }
  })["catch"]();
};

mongoose.connect(process.env.CLUSTER_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});