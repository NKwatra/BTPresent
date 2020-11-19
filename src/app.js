import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";
import initialiseStrategy from "./domain/passportStrategies";
import authRouter from "./router/authRouter";
import infoRouter from "./router/infoRouter";
import recordRouter from "./router/recordRouter";

const app = express();

app.use(bodyParser.json()); // used to parse json body from requests
app.use(passport.initialize());
app.use("/auth", authRouter); // '/auth/*' -> authRouter
app.use("/info", infoRouter); // same as auth, '/info/*'
app.use("/record", recordRouter); // '/record/*' -> recordRouter

initialiseStrategy(passport); // initiliaing passport strategies

const PORT = process.env.PORT || 3000;
mongoose.connect("mongodb://localhost:27017/btpresent", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("we're connected!");
});

app.listen(PORT, () => {
  console.log("server has started");
});
