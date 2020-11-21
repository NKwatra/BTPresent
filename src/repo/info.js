import mongoose from "mongoose";
import { University, Course, Student , StudentAttendance , TeacherAttendance} from "./models";

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
      console.log(err);
      return null;
    });
};

export const getStudentListFromDb = (address) => {
  return Student.find( { MACaddress : { $in : address }})
    .then((studentList) => {
      return studentList;
    })
    .catch((err) => {
      return null;
    });
};

export const getStudentIDFromDB = (univID, roll) => {
  const foundStudents =  Student.find( { 
    univID : mongoose.Types.ObjectId(univID) , 
    enrollmentNumber : { $in : roll } 
  })
  .then((students) => students)
  return foundStudents;
};

export const storeStudentAttendanceInDB = (courseID ,studentID) => {
  return StudentAttendance.create( {
    course : courseID,
    studentID : studentID
  })
};


export const storeTeacherAttendanceInDB = (courseID ,teacherID ) => {
  return TeacherAttendance.create( {
    course : courseID,
    teacherID : teacherID
  })
};