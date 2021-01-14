const mongoose = require("mongoose");
const DomainFunction = require("./domain/info");
const Models = require("./repo/models");

const getPreviousAttendance = DomainFunction.getPreviousAttendance;
const Student = Models.Student;
const MonthlyStudentAttendance = Models.MonthlyStudentAttendance;

// mongoose.connect(process.env.CLUSTER_URL, {
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

const storeInDb = (
  present,
  absent,
  studentID,
  univID,
  year,
  month,
  studentIndex,
  numberOfStudents
) => {
  let attendance;
  if (isNaN(present / (present + absent)) * 100) {
    attendance = 0.0;
  } else {
    attendance = (present / (present + absent)) * 100;
  }
  MonthlyStudentAttendance.create({
    year,
    month,
    studentID,
    univID,
    attendance,
  })
    .then(() => {
      console.log("Record Added");
      // if (studentIndex == numberOfStudents) db.close();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const report = () => {
  //create a date object to get the current year and month
  let dateToday = new Date();
  const year = dateToday.getFullYear();
  const month = dateToday.getMonth() + 1;
  //get all the students stored in the db
  return Student.find()
    .then((students) => {
      //for each student get the array of courses
      let numberOfStudents = students.length;
      let studentIndex = 0;
      students.forEach((student) => {
        // create two variables for each student
        studentIndex++;
        let courses = student.courses;
        let numberOfCourses = courses.length;
        let courseIndex = 0;
        let presentDays = 0;
        let absentDays = 0;
        // for each course take its ID along with the student id
        //and get the student attendance for that course
        courses.forEach((courseID) => {
          getPreviousAttendance(courseID, "STUDENT", student._id).then(
            (attendance) => {
              //use the returned attendance object to add the present
              //and absent days for that month to our variables
              presentDays +=
                attendance[year] && attendance[year][month]
                  ? attendance[year][month]["present"].length
                  : 0;
              absentDays +=
                attendance[year] && attendance[year][month]
                  ? attendance[year][month]["absent"].length
                  : 0;

              courseIndex++;
              if (courseIndex == numberOfCourses) {
                storeInDb(
                  presentDays,
                  absentDays,
                  student._id,
                  student.univID,
                  year,
                  month,
                  studentIndex,
                  numberOfStudents
                );
              }
            }
          );
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
