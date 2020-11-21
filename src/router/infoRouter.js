import { Router } from "express";
import { getAllUniversities, getAllCourses , getStudentList , storeAttendance } from "../domain/info";

const router = Router();

// '/info/universities' -> match
router.get("/universities", (req, res) => {
  // list of all registered univs and return it
  getAllUniversities().then((universities) => res.json(universities));
});

// all courses of a particular university
router.get("/courses/:university", (req, res) => {
  const { university } = req.params;
  getAllCourses(university).then((courses) => res.json(courses));
});

router.post("/extract", (req, res) => {
    const { address } = req.body;
    getStudentList(address).then((students) => res.json(students));
  });

router.get("/attendance/add", (req, res) => {
    //const { univID, students, courseID , teacherID } = req.body;
    let univID = "5fb8c56d192a3e4cfd05bc68";
    let courseID = "5fb8c5b2192a3e4cfd05bc69";
    let students = [{ roll : "201" , id : "5fb8c809192a3e4cfd05bc6a"}];
    let teacherID = "5fb8c8a8192a3e4cfd05bc6b";
    storeAttendance(univID, students, courseID , teacherID).then((response) => res.json( { saved : response }));
  });


export default router;
