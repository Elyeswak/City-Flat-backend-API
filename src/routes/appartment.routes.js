import express from "express";
import multer from "../middlewares/multer_config.js";

import {
  httpGetAllApparts,
  httpAddAppartment,
  httpGetOneAppartment,
  httpUpdateOneAppartment,
  httpDeleteOneAppart,
} from "../controllers/apartment.controller.js";

/** Defining the router */
const appartmentRouter = express.Router();

appartmentRouter.route("/getAllAppart").get(httpGetAllApparts);
appartmentRouter.route("/addAppart").post(httpAddAppartment);

export { appartmentRouter };
