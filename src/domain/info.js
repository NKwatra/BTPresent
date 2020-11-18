import { getUniversitiesFromDb, getAllCoursesFromDb } from "../repo/info";

// extract all universities registered in database
export const getAllUniversities = () => {
  return getUniversitiesFromDb().then((universities) => {
    if (universities == null) return [];

    return universities.map((university) => ({
      id: university._id,
      name: university.name,
    }));
  });
};

// all courses of a particular univ
export const getAllCourses = (university) => {
  return getAllCoursesFromDb(university).then((courses) => {
    if (courses == null) return [];
    return courses.map((course) => ({
      id: course._id,
      name: course.courseName,
    }));
  });
};
