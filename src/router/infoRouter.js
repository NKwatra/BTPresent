import { Router } from "express";
import {
  getAllUniversities,
  getAllCourses,
  getStudentList,
  addNewAttendance,
  extractAttendance,
  getPreviousAttendance
} from "../domain/info";
import passport from "passport";

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

router.post(
  "/attendance/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { univID, students, courseID } = req.body;
    const id = req.user._id;
    addNewAttendance(univID, students, courseID, id).then((saved) =>
      res.json({ saved })
    );
  }
);

router.get("/attendance", passport.authenticate("jwt", { session : false }), (req,res) => {
  const { courseID , accountType } = req.query;
  const userID = req.user._id;
  getPreviousAttendance( courseID , accountType , userID).then((previousAttendance) => {
    res.json(previousAttendance);
  });
});

router.get("/attendance/get",passport.authenticate("jwt", { session : false }) ,(req,res) => {
  const { courseID , year , month , day } = req.query;
  extractAttendance( courseID , year , month , day ).then((attendance) => res.json(attendance));
});

export default router;
