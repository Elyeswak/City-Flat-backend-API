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
  getReviewById,
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
  .get(getAllReviews)
  .delete(ensureUser, deleteReview);
appartmentRouter.route("/review/:param").get(getReviewById);

export { appartmentRouter };
