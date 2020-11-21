import { getUniversitiesFromDb, getAllCoursesFromDb, getStudentListFromDb , getStudentIDFromDB, storeStudentAttendanceInDB , storeTeacherAttendanceInDB} from "../repo/info";

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
    if (studentList == null || studentList.length == 0) 
          return [];
    else{
      let students = {
        universityID : studentList[0].univID,
      };
      students.studentPresent = studentList.map((student) => ({
          name : student.firstname + " " + student.lastname,
          rollNo : student.enrollmentNumber,
          id : student._id
      }));
      return students;
    }
    });
};

export const storeAttendance = (univID, students, courseID , teacherID) => {
    let roll = students.map((student) => student.roll );
    return getStudentIDFromDB(univID, roll)
    .then((Foundstudents) => {
      let studentID = [];
      Foundstudents.forEach((student) => {
        console.log(student._id);
        studentID.push(student._id);
      });
        return storeStudentAttendanceInDB(courseID , studentID);
    })
    .then((resp) => {
      console.log("First input Successful " + resp);
        return storeTeacherAttendanceInDB(courseID , teacherID);
    })
    .then((resp) => {
      console.log("Second input Successful " + resp);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    })
};
