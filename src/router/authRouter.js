import { Router } from "express";
import { signUp, login, loginMiddleware } from "../domain/auth";
import passport from "passport";
const router = Router();

router.post("/login", loginMiddleware, (req, res) => {
  login(req.user).then((response) => res.json(response));
});

// '/auth/signup' -> match
router.post("/signup", (req, res) => {
  // extract user data
  const {
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
  } = req.body;

  // register user into the db
  signUp({
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
  }).then((resp) => {
    res.json(resp); // API token is returned
  });
});

// '/auth/check' -> match
router.post(
  "/check",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // if not reached here, passport automatically tells that
    // unauthenticated
    res.json(true); // tell user that he/she is authenticated
  }
);

export default router;
