import { Router } from "express";
import { signUp, login, loginMiddleware } from "../domain/auth";
import passport from "passport";
const router = Router();

router.post("/login", loginMiddleware, (req, res) => {
  console.log(req.user);
  login(req.user).then((response) => res.json(response));
});

router.post("/signup", (req, res) => {
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
    res.json(resp);
  });
});

router.post(
  "/check",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(true);
  }
);

export default router;
