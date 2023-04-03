import express from 'express';
import multer from "../middlewares/multer_config.js";
import passport from "passport";
import { stripeWebhookMiddleware } from "../middlewares/stripe_handler.js";
import paypal from 'paypal-rest-sdk';
import {

   httpLoginUser,
   httpRegisterUser,
   httpDeleteOneUser,
   httpGetOneUser,
   httpUpdateOneUser,
   httpGetAllUsers,
   httpResetPassword,
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
   ensureAuth,
   validateLogin,
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
   httpCreateOrder,
   httpGetMyReservations,
   httpGetAllReservations,
   httpGetOneReservation,
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
      httpRegisterUser
   );
userRouter.route('/login').post(validateLogin, httpLoginUser);
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
   .route('/appartments/addAppartment/verify/:param')
   .post(
      ensureAdmin,
      multer("img", 512 * 1024),

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
//reservations
userRouter
   .route('/reservations/getall')
   .get(ensureUser, httpGetMyReservations);
//admin get all reservations
userRouter
   .route('/reservations/getallReservations')
   .get(ensureAuth, httpGetAllReservations);

userRouter
   .route('/reservations/addReservation')
   .post(

   
      ensureUser,
      httpCreateReservation
   );
   //create order
   userRouter
   .route('/reservations/createOrder')
   .post(

   
      ensureUser,
      httpCreateOrder
   );

userRouter
   .route('/reservations/decline/:param')
   .delete(ensureUser, httpDeclineReservation);
userRouter
   .route('/reservations/getOne/:param')
   .get(ensureUser, httpGetOneReservation);
userRouter
   .route('/reservations/accept/:param')
   .post(ensureAdmin, httpAdminAcceptReservation);

userRouter
   .route('/reservations/adminDecline/:param')
   .delete(ensureAdmin, httpAdminDeclineReservation);
userRouter
   .route("/webhooks/stripe")
   .post(stripeWebhookMiddleware, (req, res) => {
      const event = req.stripeEvent;

      switch (event.type) {
         case 'payment_intent.succeeded':
            // Handle payment succeeded event
            break;

         case 'payment_intent.payment_failed':
            // Handle payment failed event
            break;

         case 'payment_intent.amount_capturable_updated':
            // Handle amount capturable updated event
            break;

         case 'payment_intent.canceled':
            // Handle payment canceled event
            break;

         default:
            console.log(`Unhandled event type ${event.type}`);
      }

      res.sendStatus(200);
   });

userRouter
   .get('/auth/google',
      passport.authenticate('google', { scope: ['profile', 'email'] }));

userRouter
   .get('/api/sessions/oauth/google',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function (req, res) {
         // Successful authentication, redirect home.
         res.redirect(200, '/user/reservations/getallReservations');

      });





export { userRouter };


