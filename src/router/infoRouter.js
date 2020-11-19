import { Router } from "express";
import { getAllUniversities, getAllCourses , getStudentList } from "../domain/info";

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

export default router;
