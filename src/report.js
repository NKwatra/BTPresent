const DomainFunction = require("./domain/info");
const Models = require("./repo/models");

const getPreviousAttendance = DomainFunction.getPreviousAttendance;
const Student = Models.Student;
const MonthlyStudentAttendance = Models.MonthlyStudentAttendance;

const storeInDb = (present,absent,studentID,univID, year,month) => {
        let attendance = (present/(present + absent))*100;
        MonthlyStudentAttendance.create({ year ,  month , studentID, univID , attendance})
        .then(() => {
            console.log("Record Added");
        }).catch((err) => {
            console.log(err);
        })
}

const report = () => {
    //create a date object to get the current year and month
    let dateToday = new Date();
    const year = dateToday.getFullYear();
    const month = (dateToday.getMonth()) + 1;
    //get all the students stored in the db
    Student.find()
    .then((students) => {
        //for each student get the array of courses
        students.forEach((student) => {
            // create two variables for each student
            let courses = student.courses;
            let len=courses.length;
            let index=0;
            let presentDays = 0;
            let absentDays = 0;
            // for each course take its ID along with the student id 
            //and get the student attendance for that course
            courses.forEach((courseID) => {
                getPreviousAttendance(courseID , "STUDENT" , student._id)
                .then((attendance) => {
                    //use the returned attendance object to add the present 
                    //and absent days for that month to our variables
                        presentDays = presentDays + attendance[year][month]["present"].length;
                        absentDays = absentDays + attendance[year][month]["absent"].length;
                        index++;
                        if(index==len)
                        {
                            storeInDb(presentDays,absentDays,student._id, student.univID, year,month);
                        }
                            
                })
            })
        })
    }).catch((err) => {
        console.log(err);
    })
};


