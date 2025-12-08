import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.mjs";
import AppError from "./utils/AppError.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "./strategies/local-strategy.mjs";
import SequelizeStore from "connect-session-sequelize";
import sequelize from "./config/connection.mjs";
import signature from "cookie-signature";

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL, //"http://localhost:5173", //true
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

const SequelizeStoreInstance = SequelizeStore(session.Store);

const store = new SequelizeStoreInstance({
  db: sequelize,
});

// store.get = function (sid, callback) {
//   const unsigned = sid.startsWith("s:")
//     ? signature.unsign(sid.slice(2), process.env.COOKIE_SECRET)
//     : sid;

//   SequelizeStoreInstance.prototype.get.call(this, unsigned, callback);
// };

await store.sync();

app.disable("etag");

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 60000 * 60, // one hour
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      // secure: "auto",
    },
    name: "connect.sid",
    store: store,
  })
);


app.use(passport.initialize());
app.use(passport.session());



app.use("/api", routes);

app.use((req, res, next) => {
  console.log(req.originalUrl, req.method);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

export default app;
