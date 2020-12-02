import {
  getUniversitiesFromDb,
  getAllCoursesFromDb,
  getStudentListFromDb,
  extractStudentID,
  insertStudentAttendance,
  insertClassRecord,
  getAbsentRecordFromDB,
  getStudentAttendanceFromDB,
  getTeacherAttendanceFromDB
} from "../repo/info";

// extract all universities registered in database
export const getAllUniversities = () => {
  return getUniversitiesFromDb().then((universities) => {
    if (universities == null) return [];

    return universities.map((university) => ({
      id: university._id,
      name: university.name,
    }));
  });
};

// all courses of a particular univ
export const getAllCourses = (university) => {
  return getAllCoursesFromDb(university).then((courses) => {
    if (courses == null) return [];
    return courses.map((course) => ({
      id: course._id,
      name: course.courseName,
    }));
  });
};

export const getStudentList = (address) => {
  return getStudentListFromDb(address).then((studentList) => {
    if (studentList == null || studentList.length == 0) return [];
    else {
      let students = {
        universityID: studentList[0].univID,
      };
      students.studentPresent = studentList.map((student) => ({
        name: student.firstname + " " + student.lastname,
        roll: student.enrollmentNumber,
        id: student._id,
      }));
      return students;
    }
  });
};

export const addNewAttendance = (univID, students, courseID, teacherID) => {
  let studenstWithoutId = students
    .filter((student) => !student.hasOwnProperty("id"))
    .map((student) => student.roll);
  let studentsWithID = students
    .filter((student) => student.hasOwnProperty("id"))
    .map((student) => student.id);
  const studentAttendancePromise = extractStudentID(
    univID,
    studenstWithoutId
  ).then((students) => {
    let ids = students.map((student) => student._id);
    return insertStudentAttendance([...ids, ...studentsWithID], courseID).then(
      (res) => res
    );
  });

  const classRecordPromise = insertClassRecord(teacherID, courseID);

  return Promise.all([studentAttendancePromise, classRecordPromise])
    .then(() => true)
    .catch(() => false);
};

export const getPreviousAttendance = (courseID , accountType , userID) => {
    let attendanceRecord = {};
    //Check for the account type
    //if account type is student
    if(accountType === "STUDENT")
    { 
      //fetch the days student was present
      return getStudentAttendanceFromDB(courseID , userID).then((presentDays) =>{
        //after successfully getting the present record fetch the days student was absent
        return getAbsentRecordFromDB(courseID,userID).then((absentDays) => {
          presentDays.forEach((day) => {
            //Extract the year and month for each date the student was present
            let year = day.lectureDate.getFullYear();
            //Month is indexed with 0 i.e. January = 0, adding 1 to start indexing from 1
            let month = (day.lectureDate.getMonth()) +1;
            if(attendanceRecord.hasOwnProperty(year))
            {
                if(attendanceRecord[year].hasOwnProperty(month))
                {
                  attendanceRecord[year][month]["present"].push(day.lectureDate.getDate());
                }
                else{
                  attendanceRecord[year][month] = {
                  present : [day.lectureDate.getDate()],
                  absent : [],
                  }
                }
            }
            else
            {
              attendanceRecord[year] = {
                [month] : {
                  present : [day.lectureDate.getDate()],
                  absent : [],
                }
              }
            }
          })
          //Enter the dates for which the student was absent in the object to be returned
          absentDays.forEach((day) => {
            const year = day.lectureDate.getFullYear();
            const month = (day.lectureDate.getMonth()) +1;
            if(attendanceRecord.hasOwnProperty(year))
            {
                if(attendanceRecord[year].hasOwnProperty(month))
                {
                  attendanceRecord[year][month]["absent"].push(day.lectureDate.getDate());
                }
                else{
                  attendanceRecord[year][month] = {
                  present : [],
                  absent : [day.lectureDate.getDate()],
                  }
                }
            }
            else
            {
              attendanceRecord[year] = {
                [month] : {
                  present : [],
                  absent : [day.lectureDate.getDate()],
                }
              }
            }
          })
          return attendanceRecord;
      }).catch((err) => {
        console.log("Error in second student function " + err);
      })
    }).catch((err) => {
      console.log("Error in first student function " + err);
    })
    }
    //if account type is teacher
    else
    {
      //fetch the days for which teacher took the lecture
      return getTeacherAttendanceFromDB(courseID,userID).then((attendance) => {
        attendance.forEach((day) => {
          const year = day.lectureDate.getFullYear();
          const month = (day.lectureDate.getMonth()) +1;
          if(attendanceRecord.hasOwnProperty(year))
          {
              if(attendanceRecord[year].hasOwnProperty(month))
              {
                attendanceRecord[year][month]["present"].push(day.lectureDate.getDate());
              }
              else{
                attendanceRecord[year][month] = {
                present : [day.lectureDate.getDate()],
                }
              }
          }
          else
          {
            attendanceRecord[year] = {
              [month] : {
                present : [day.lectureDate.getDate()],
              }
            }
          }
        })
      
      return attendanceRecord;
      }).catch((err) => {
        console.log("Error in teacher function " + err);
      })
      
    } 
};
