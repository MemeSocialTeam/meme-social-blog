import passport from "passport";
import AppError from "../utils/AppError.mjs";
import { Strategy as LocalStrategy } from "passport-local";
import { compareHashedPassword } from "../utils/helpers/hashPassword.mjs";
import User from "../models/user.mjs";

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('deserializeUser', id);
  try {
    const user = await User.findByPk(id);
    console.log('deserializeUser', user);
    if (!user) return done(new AppError("User not found", 404), null);
    done(null, user);
  } catch (err) {
    return done(err, null);
  }
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({where: {email}})
        console.log('locStr', user);
        if (!user) return done(null, false, { message: "User not found" });
        const isMatch = await compareHashedPassword(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Invalid credentials" });
        done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;