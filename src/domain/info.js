import { getUniversitiesFromDb, getAllCoursesFromDb, getStudentListFromDb } from "../repo/info";

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
          roll : student.enrollmentNumber,
          id : student._id
      }));
      return students;
    }
    });
};
