import express from 'express';
import multer from "../middlewares/multer_config.js";
import {

   httpLoginUser,
   httpRegisterUser,
   httpDeleteOneUser,
   httpGetOneUser,
   httpUpdateOneUser,
   httpGetAllUsers,
   httpResetPassword,
   httpGetMyNotifications,
   
} from '../controllers/user.controller.js';

import {
   httpVerifyEmail,
   httpResetPasswordByEmail,
   httpResendVerificationEmail,
   
} from '../controllers/mailling.controller.js';



import { body } from 'express-validator';
import {
   ensureAdmin,
   ensureUser,
   ensureLoggedIn,
} from '../middlewares/authorization-handler.js';

import {
   
   httpAddAppartment,
   httpGetOneAppartment,
   httpUpdateOneAppartment,
   httpDeleteOneAppart,

} from '../controllers/apartment.controller.js';

import {
   httpAddService,
   httpGetAllServices,
   httpGetOneService,
   httpUpdateOneService,
   httpDeleteOneService,

} from '../controllers/service.controller.js';



import { 
   httpCreateReservation,
   httpGetMyReservations,
   httpDeclineReservation,
   httpAdminAcceptReservation,
   httpAdminDeclineReservation,
} from '../controllers/reservation.controller.js';
/** Defining the router */
const userRouter = express.Router();

/** Handling requests */

userRouter
   .route('/register')
   .post(
      multer("img", 512 * 1024),
      body('name').isLength({ min: 5 }),
      body('email').isEmail(),
      body('number').isLength({ min: 8 }),
      body('password').isLength({ min: 4 }),
      body('birthday').isDate(),
      httpRegisterUser
   );
userRouter.route('/login').post(httpLoginUser);
userRouter
   .route('/:param')
   .get(httpGetOneUser)
   .put(ensureUser, httpUpdateOneUser)
   .delete(ensureUser, httpDeleteOneUser);

userRouter
   .route('/')
   .get(httpGetAllUsers);

userRouter
   .route('/reset/:param')
   .get(httpResetPasswordByEmail)
   .post(ensureLoggedIn, httpResetPassword);

userRouter
   .route('/verify/:param')
   .get(httpResendVerificationEmail)
   .post(httpVerifyEmail);
//add appartment
   userRouter
   .route('/appartments/addAppartment')
   .post(
      ensureAdmin,
      multer("img", 512 * 1024),
      body('name').isLength({ min: 5 }),
      body('description'),
      body('pricePerNight'),
      body('FromDate').isDate(),
      body('ToDate').isDate(),
      body('location'),
      body('rooms'),
      httpAddAppartment,


   );
   //add service
   userRouter
   .route('/services/addService')
   .post(
      ensureAdmin,
      multer("img", 512 * 1024),
      body('name').isLength({ min: 5 }),
      body('description'),
      body('pricePerNight'),
    
      httpAddService,


   );
   //admin/appartment routes
   userRouter
   .route('/appartments/:param')
   .get(httpGetOneAppartment)
   .put(ensureAdmin, httpUpdateOneAppartment)
   .delete(ensureAdmin, httpDeleteOneAppart);
// get/update/delete service
   userRouter
   .route('/services/:param')
   .get(httpGetOneService)
   .put(ensureAdmin, httpUpdateOneService)
   .delete(ensureAdmin, httpDeleteOneService);
   //get all services
   userRouter
   .route('/service/getAllServices')
   .get(httpGetAllServices);
   //get all notifications for one user
   userRouter
   .route('/reservations/getNotifications')
   .get(ensureUser,httpGetMyNotifications);
//reservations
   userRouter
   .route('/reservations/getall')
   .get(ensureUser,httpGetMyReservations);

   userRouter
   .route('/reservations/addReservation')
   .post(
      
      body('description').isLength({ min: 5 }),
      body('totalPrice'),
      body('checkIn').isDate(),
      body('checkOut').isDate(),
      body('servicesFee'),
      body('nightsFee'),
      //ensureLoggedIn,
      ensureUser,
      httpCreateReservation
   );

   userRouter
   .route('/reservations/decline/:param')
   .delete(ensureUser,httpDeclineReservation);

   userRouter
   .route('/reservations/accept/:param')
   .post(ensureAdmin,httpAdminAcceptReservation);

   userRouter
   .route('/reservations/adminDecline/:param')
   .delete(ensureAdmin,httpAdminDeclineReservation);
export { userRouter };


