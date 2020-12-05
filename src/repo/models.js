import mongoose from "mongoose";

const universitySchema = new mongoose.Schema({
  name: String,
});

const courseSchema = new mongoose.Schema({
  courseName: String,
  univID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "university",
  },
});

const teacherSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
  ],
  univID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "university",
  },
});

const studentSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  alternateEmail: String,
  enrollmentNumber: String,
  MACaddress: String,
  password: String,
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
  ],
  univID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "university",
  },
});

const studentAttendanceSchema = new mongoose.Schema({
  lectureDate: { type: Date, default: Date.now },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
  studentID: [
    { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
    },
  ],
});

const teacherAttendanceSchema = new mongoose.Schema({
  lectureDate: { type: Date, default: Date.now },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
  teacherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
  },
});

export const University = mongoose.model("university", universitySchema);
export const Course = mongoose.model("course", courseSchema);
export const Student = mongoose.model("student", studentSchema);
export const Teacher = mongoose.model("teacher", teacherSchema);
export const StudentAttendance = mongoose.model(
  "studentAttendance",
  studentAttendanceSchema
);
export const TeacherAttendance = mongoose.model(
  "teacherAttendance",
  teacherAttendanceSchema
);
