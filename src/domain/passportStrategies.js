import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { searchById, searchByUsername } from "../repo/auth";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

let options = {};
options.secretOrKey = process.env.JWT_SECRET;
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

export default function (passport) {
  passport.use(
    new JwtStrategy(options, (payload, done) => {
      searchById(payload.id)
        .then((result) => {
          if (!result) done(null, false);
          else done(null, result);
        })
        .catch((err) => done(err));
    })
  );

  passport.use(
    new LocalStrategy((username, password, done) => {
      const [trueUsername, univId, address] = username.split("$");
      searchByUsername(trueUsername, univId, address)
        .then((users) => {
          if (users.length == 0)
            done(null, false, { message: "User does not exist" });
          else {
            bcrypt.compare(password, users[0].password).then((result) => {
              if (result) done(null, users[0]);
              else
                done(null, false, {
                  message: "Incorrect username or password",
                });
            });
          }
        })
        .catch((err) => done(err));
    })
  );
}
