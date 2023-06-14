
import fetch from "node-fetch";
import dotenv from 'dotenv';
import paypal from 'paypal-rest-sdk';
import { findOneOrderByFilter, httpCreateReservationPaypal } from "./reservation.controller.js";

const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

//paypal config
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': PAYPAL_CLIENT_ID,
    'client_secret': PAYPAL_APP_SECRET
});


export async function Paypalexecute(req, res) {
    try {
      var orderId=req.params.param;
      const foundOrder = await findOneOrderByFilter(orderId);
  
      const execute_payment_json = {
        "payer_id": req.query.PayerID,
        "transactions": [{
          "amount": {
            "currency": "EUR",
            "total": String(foundOrder.totalPrice),
          },
        }],
      };
  
      const paymentId = req.query.paymentId;
  
      const payment = await new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
          if (error) {
            console.log(error.response);
            reject(error);
          } else {
            resolve(payment);
          }
        });
      });
  
      await httpCreateReservationPaypal(foundOrder, req, res);
 
      
        

     
     
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


export  async function  PaypalPay(  req,res ){
  var orderId=req.params.param;
    findOneOrderByFilter(orderId).then((foundOrder)=>{




        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://127.0.0.1:9090/paypal/success",
                "cancel_url": "http://127.0.0.1:9090/paypal/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price":String( foundOrder.totalPrice),
                        "currency": "EUR",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "EUR",
                    "total": String( foundOrder.totalPrice),
                },
                "description": "This is the payment description."
            }]
        };
        
        
        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                for (var index = 0; index < payment.links.length; index++) {
                    //Redirect user to this endpoint for redirect url
                    if (payment.links[index].rel === 'approval_url') {
        
        
                        res.redirect(payment.links[index].href);
                        console.log("Redirected to approval_url successfully");
        
                    }
                }
            }
        });

    }).catch((err)=>{

res.status(404).json({message:err.message});

    });



}


