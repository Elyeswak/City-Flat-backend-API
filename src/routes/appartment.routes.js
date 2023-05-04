import express from 'express';
import multer from "../middlewares/multer_config.js";

import {
    httpGetAllApparts,
    httpAddAppartment,
    httpGetOneAppartment,
    httpUpdateOneAppartment,
    httpDeleteOneAppart,
 
 } from '../controllers/apartment.controller.js';


 import { getAllReviews,createReview,deleteReview,updateReview } from '../controllers/review.controller.js';
import { ensureUser } from '../middlewares/authorization-handler.js';

 /** Defining the router */
const appartmentRouter = express.Router();


appartmentRouter
.route('/reviews/:param')
   .post(ensureUser,createReview)
   .get(ensureUser,getAllReviews)
   .delete(ensureUser,deleteReview);

appartmentRouter
.route('/all/getAllAppart')
   .get(httpGetAllApparts);




export { appartmentRouter };