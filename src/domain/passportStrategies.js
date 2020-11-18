import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { searchById, searchByUsername } from "../repo/auth";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

let options = {};
options.secretOrKey = process.env.JWT_SECRET;
// Authorization: Bearer <token>
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// header.payload.signature -> payload => decrypt

export default function (passport) {
  // initialising jwt based requests
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
      // username$univId$MACaddress
      const [trueUsername, univId, address] = username.split("$");
      // search for a student or a teacher with given username
      // TODO: update MAC address only if passwords match
      searchByUsername(trueUsername, univId, address)
        .then((users) => {
          // no such user exist
          if (users.length == 0)
            done(null, false, { message: "User does not exist" });
          else {
            // compare password stored in db to sent password
            bcrypt.compare(password, users[0].password).then((result) => {
              // passwords match
              if (result) done(null, users[0]);
              // passwords don't match
              else
                done(null, false, {
                  message: "Incorrect username or password",
                });
            });
          }
        })
        .catch((err) => done(err)); // error at server
    })
  );
}
