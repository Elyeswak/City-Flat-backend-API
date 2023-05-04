import express from "express";
import multer from "../middlewares/multer_config.js";

import {
  httpGetAllApparts,
  httpAddAppartment,
  httpGetOneAppartment,
  httpUpdateOneAppartment,
  httpDeleteOneAppart,
} from "../controllers/apartment.controller.js";

import {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  updateApartmentRating,
} from "../controllers/review.controller.js";
import { ensureUser } from "../middlewares/authorization-handler.js";

/** Defining the router */
const appartmentRouter = express.Router();

appartmentRouter.route("/getAllAppart").get(httpGetAllApparts);
appartmentRouter.route("/addAppart").post(httpAddAppartment);

appartmentRouter
  .route("/reviews/:param")
  .post(ensureUser, createReview)
  .put(ensureUser, updateReview)
  .put(ensureUser, updateApartmentRating)
  .get(ensureUser, getAllReviews)
  .delete(ensureUser, deleteReview);

appartmentRouter.route("/getAllAppart").post(httpGetAllApparts);

export { appartmentRouter };
