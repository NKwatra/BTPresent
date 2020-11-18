import { Router } from "express";
import { getAllUniversities, getAllCourses } from "../domain/info";

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

export default router;
