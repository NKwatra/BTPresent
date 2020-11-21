import mongoose from "mongoose";
import {
  University,
  Course,
  Student,
  StudentAttendance,
  TeacherAttendance,
} from "./models";

export const getUniversitiesFromDb = () => {
  return University.find({})
    .then((universities) => {
      return universities;
    })
    .catch((err) => {
      return null;
    });
};

export const getAllCoursesFromDb = (university) => {
  return Course.find({ univId: mongoose.Types.ObjectId(university) })
    .then((courses) => courses)
    .catch((err) => {
      return null;
    });
};

export const getStudentListFromDb = (address) => {
  return Student.find({ MACaddress: { $in: address } })
    .then((studentList) => {
      return studentList;
    })
    .catch((err) => {
      return null;
    });
};

export const extractStudentID = (univID, enrollments) => {
  return Student.find({
    univID: mongoose.Types.ObjectId(univID),
    enrollmentNumber: { $in: enrollments },
  }).exec();
};

export const insertStudentAttendance = (ids, courseId) => {
  return StudentAttendance.create({ course: courseId, studentID: ids }).then(
    () => true
  );
};

export const insertClassRecord = (teacherID, course) => {
  return TeacherAttendance.create({ teacherID, course }).then(() => true);
};
