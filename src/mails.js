const sendGrid = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { getAllUniversities } = require("./domain/info");
const { Student } = require("./repo/models");
const { report } = require("./report");
const { sendpdf } = require("./sendpdf");

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

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const readPdf = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(data.toString("base64"));
    });
  });
};

const db = mongoose.connection;

db.on("error", (err) => console.log("Failed with error ", err));
db.once("open", () => {
  // console.log(sendPdf);
  report()
    .then(() => sendpdf())
    .then(() => {
      getAllUniversities()
        .then((universities) => {
          let promises = [];
          if (universities.length > 0) {
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth();
            let id;
            for (let i = 0; i < universities.length; i++) {
              id = universities[i].id;
              promises.push(sendEmails(id, year, month, universities[i].name));
            }
          }
          Promise.all(promises).then((results) => {
            console.log("all resolved", results);
            db.close();
          });
        })
        .catch((err) => console.log(err));
    });
});

const sendEmails = (id, year, month, name, isLast) => {
  return Student.find({ univID: mongoose.Types.ObjectId(id) })
    .then((students) => {
      if (students.length > 0) {
        readPdf(
          path.resolve(
            __dirname,
            `../attendance/${monthNames[month]}_${year}_${id}.pdf`
          )
        )
          .then((data) => {
            console.log("file read");
            const msg = {
              to: students.map((student) => student.email),
              from: "kwatranishkarsh@gmail.com",
              subject: `Short attendance list for ${monthNames[month]} ${year}`,
              html: `Dear Student, <br /> <br />
              Please Find Attached the short attendance list for ${monthNames[month]}. <br />
            Please take care of your attendance to avoid getting detained if you have short attendance.`,
              attachments: [
                {
                  content: data,
                  type: "application/pdf",
                  contentId: "attendance",
                  filename: `Attendance ${monthNames[month]} ${year} ${name}.pdf`,
                },
              ],
            };

            console.log("sending email to ", id);

            sendGrid
              .send(msg)
              .then(() => {
                console.log("successfull sent mail");
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    })
    .catch();
};

mongoose.connect(process.env.CLUSTER_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
