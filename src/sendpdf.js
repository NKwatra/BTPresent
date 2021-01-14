const mongoose = require("mongoose");
const pdfPrinter = require("pdfmake");
const fs = require("fs-extra");
const Models = require("./repo/models");
const RepoFunction = require("./repo/info");

const MonthlyStudentAttendance = Models.MonthlyStudentAttendance;
const getUniversitiesFromDb = RepoFunction.getUniversitiesFromDb;

// mongoose.connect(process.env.CLUSTER_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("we're connected!");
//   sendpdf();
// });

const getAttendance = (universityID, year, month) => {
  return MonthlyStudentAttendance.find({
    univID: mongoose.Types.ObjectId(universityID),
    year: year,
    month: month,
    attendance: { $lt: 60 },
  })
    .populate({
      path: "studentID",
      model: "student",
    })
    .exec();
};

const buildTableBody = (data, columns) => {
  let body = [];

  body.push(columns);

  data.forEach((row) => {
    let dataRow = [];

    columns.forEach((column) => {
      dataRow.push(row[column].toString());
    });

    body.push(dataRow);
  });

  return body;
};

const table = (data, columns) => {
  return {
    table: {
      headerRows: 1,
      body: buildTableBody(data, columns),
    },
    margin: [130, 25, 10, 10],
    layout: {
      hLineColor: function () {
        return "blue";
      },
      vLineColor: function () {
        return "blue";
      },
      paddingLeft: function () {
        return 15;
      },
      paddingRight: function () {
        return 15;
      },
      paddingTop: function () {
        return 4;
      },
      paddingBottom: function () {
        return 4;
      },
    },
  };
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const makeString = (year, month) => {
  const message =
    "The following is the list of students with their attendance less than 60% for the month of " +
    monthNames[month - 1] +
    ", " +
    year.toString();
  return message;
};
const makepdfs = (attendance, year, month, id) => {
  const fonts = {
    Roboto: {
      normal: "fonts/roboto.regular.ttf",
      bold: "fonts/roboto.medium.ttf",
      italics: "fonts/roboto.italic.ttf",
      bolditalics: "fonts/roboto.medium-italic.ttf",
    },
  };
  const printer = new pdfPrinter(fonts);
  const shortAttendance = attendance.map((record) => ({
    Name: record.studentID.firstname + " " + record.studentID.lastname,
    Enrollment_Number: record.studentID.enrollmentNumber,
  }));
  let docDefinition = {
    pageSize: "A4",
    pageMargins: [50, 50, 50, 50],
    footer: function (currentPage, pageCount) {
      return {
        alignment: "center",
        text: currentPage.toString() + " of " + pageCount,
        fontSize: 8,
        margin: [10, 20, 10, 20],
      };
    },
    content: [
      { text: "Short Attendance Record", style: "header" },
      { text: makeString(year, month), style: "text" },
      table(shortAttendance, ["Name", "Enrollment_Number"]),
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
      text: {
        fontSize: 14,
      },
    },
  };
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(
    fs.createWriteStream(
      "attendance/" + monthNames[month - 1] + "_" + year + "_" + id + ".pdf"
    )
  );
  pdfDoc.end();
};

export const sendpdf = () => {
  let dateToday = new Date();
  const year = dateToday.getFullYear();
  const month = dateToday.getMonth() + 1;
  return getUniversitiesFromDb().then((universities) => {
    universities.forEach((university) => {
      getAttendance(university._id, year, month).then((attendance) => {
        makepdfs(attendance, year, month, university._id);
        // db.close();
      });
    });
  });
};
