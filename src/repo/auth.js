import { Student, Teacher } from "./models";
import mongoose from "mongoose";
export const signUpStudent = ({
  fName,
  lName,
  email,
  altEmail,
  enrollNo,
  university,
  macAddress,
  password,
  courses,
}) => {
  return Student.create({
    firstname: fName,
    lastname: lName,
    email,
    alternateEmail: altEmail,
    enrollmentNumber: enrollNo,
    MACaddress: macAddress,
    password: password,
    univID: university,
    courses,
  })
    .then((student) => ({
      id: student._id,
    }))
    .catch((err) => {
      return null;
    });
};

export const signUpTeacher = ({
  fName,
  lName,
  email,
  university,
  password,
  courses,
}) => {
  return Teacher.create({
    firstname: fName,
    lastName: lName,
    email,
    password,
    courses,
    univID: university,
  })
    .then((teacher) => ({
      id: teacher._id,
    }))
    .catch((err) => null);
};

export const searchById = (id) => {
  const searchStudent = Student.findById(id)
    .then((student) => student)
    .catch(() => null);

  const searchTeacher = Teacher.findById(id)
    .then((teacher) => teacher)
    .catch(() => null);

  return Promise.all([searchStudent, searchTeacher]).then((results) => {
    if (results[0] == null && results[1] == null) return null;
    return results[0] || results[1];
  });
};

export const searchByUsername = (username, university, address) => {
  const searchStudent = Student.find({
    enrollmentNumber: username,
    univID: mongoose.Types.ObjectId(university),
  })
    .then((student) => student)
    .catch(() => null);

  const searchTeacher = Teacher.find({
    email: username,
    univID: mongoose.Types.ObjectId(university),
  })
    .then((teacher) => teacher)
    .catch(() => null);

  return Promise.all([searchStudent, searchTeacher]).then((results) => {
    if (!results[0] && !results[1]) return [];

    /*
      If it is a student user, update it's MAC address in database 
    */
    if (results[0]) {
      console.log("update command called");
      Student.findByIdAndUpdate(results[0][0]._id, {
        MACaddress: address,
      }).exec();
    }
    return results[0] || results[1];
  });
};
