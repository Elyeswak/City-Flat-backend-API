import paypal from 'paypal-rest-sdk';
import express from 'express';
import { PaypalPay, Paypalexecute } from '../controllers/paypal.controller.js';
import { ensureUser } from '../middlewares/authorization-handler.js';
const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

//paypal config
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_APP_SECRET,
});

/** Defining the router */
const paypalRouter = express.Router();

//*********paypal payment routes*******//
let amount = 0;

paypalRouter
 .route('/success')
    .get(Paypalexecute);

    paypalRouter
    .get("/cancel", (req, res) => {

       
    });

paypalRouter
.route('/pay')
    .post(ensureUser,PaypalPay);


export { paypalRouter };
