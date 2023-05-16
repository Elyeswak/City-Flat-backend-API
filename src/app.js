import express from "express";
import cors from "cors";
import { notFoundError, errorHandler } from "./middlewares/error_handler.js";
import { handleSockets } from "./utils/database/socket.handler.js";
import Passport from "./middlewares/passport.js";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";

import bodyParser from "body-parser";

import morgan from "morgan";
/* Imports from project modules */

import { userRouter } from "./routes/user.routes.js";
import { appartmentRouter } from "./routes/appartment.routes.js";
import { paypalRouter } from "./routes/paypal.routes.js";
import { HelpRouter } from "./routes/help.routes.js";
import { searchRouter } from "./routes/search.routes.js";
import startNotificationCleanup from "./utils/notificationCleanup.js";
import bookedDatesCleanup from "./utils/bookedDatesCleanup.js";

import cloudinary from "cloudinary";

import dotenv from "dotenv";

/* Accessing .env content */
dotenv.config();

/* Creating express app */
const app = express();

app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Route to generate signature
app.get("/signature", (req, res) => {
  const timestamp = req.query.timestamp;
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      upload_preset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
    },
    process.env.REACT_APP_CLOUDINARY_SECRET
  );

  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.json({
    signature: signature,
  });
});

cloudinary.v2.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_SECRET,
});

app.delete("/delete-from-cloudinary/:filename", async (req, res) => {
  const prefix = `CityFlat-assets/profile_imgs/${req.params.filename}`;
  const result = await cloudinary.v2.api.delete_resources_by_prefix(prefix);
  res.json(result);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/img", express.static("public/images"));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: new Date(Date.now() + 3600000),
    },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
Passport();

/* Handling different sockets */
handleSockets();

//cron Jobs
startNotificationCleanup();
bookedDatesCleanup();

app.use(passport.initialize());
app.use(passport.session());

/* Using routers */
app.use("/user", userRouter);

app.use("/appartments", appartmentRouter);

app.use("/paypal", paypalRouter);
app.use("/help", HelpRouter);
app.use("/searchApart", searchRouter);

/** Error handlers */
app.use(notFoundError);
app.use(errorHandler);

export default app;
