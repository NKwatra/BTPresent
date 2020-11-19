import mongoose from "mongoose";
import { Student } from "./models";

export const getStudentListFromDb = (address) => {
  return Student.find( { MACaddress : { $in : address }})
    .then((studentList) => {
      return studentList;
    })
    .catch((err) => {
      return null;
    });
};

