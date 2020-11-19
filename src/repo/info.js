import mongoose from "mongoose";
import { University, Course, Student } from "./models";

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