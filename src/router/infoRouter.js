import { Router } from "express";
import {
  getAllUniversities,
  getAllCourses,
  getStudentList,
  addNewAttendance,
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

export default router;
