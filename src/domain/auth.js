import { signUpStudent, signUpTeacher } from "../repo/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

export const signUp = ({
  accountType,
  fName,
  lName,
  password,
  university,
  email,
  altEmail,
  enrollNo,
  macAddress,
  courses,
}) => {
  return bcrypt.hash(password, 10).then((hash) => {
    password = hash; // set hash as password
    // store promise
    const signUpPromise =
      accountType === "STUDENT"
        ? signUpStudent({
            fName,
            lName,
            password,
            university,
            email,
            altEmail,
            enrollNo,
            macAddress,
            courses,
          })
        : signUpTeacher({
            fName,
            lName,
            password,
            university,
            courses,
            email,
          });

    return signUpPromise.then((response) => {
      if (response === null)
        // if signup failed somehow
        return { message: "There was some error, please try again later" };
      // create jwt token from id, 15 min expiration
      const token = jwt.sign(response, process.env.JWT_SECRET, {
        expiresIn: 15 * 60,
      });
      return { token }; // {'token': token}
    });
  });
};

/*
    Function to send user an API token and courses of user
    on successful login
*/
export const login = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 15 * 60,
  });

  return user
    .populate("courses", "courseName _id")
    .execPopulate()
    .then(() => {
      return { selectedCourses: user.courses, token };
    });
};

/* 
    Middleware to send customised message in case
    of login failure to user
*/
export const loginMiddleware = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.status(401).json({ message: info.message }).end();
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};
