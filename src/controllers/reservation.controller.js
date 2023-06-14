import mongoose from 'mongoose';
import Stripe from 'stripe';
import reservationDb from '../models/reservation.model.js';
import orderDb from '../models/order.model.js';
import appartmentDb from '../models/appartment.model.js';
import userDb from '../models/user.model.js';
import cardM from '../models/userCards.model.js';
import serviceDb from '../models/service.model.js';
import { validationResult } from 'express-validator';
import { findOneUserByFilter, userFormat } from '../controllers/user.controller.js';
import { sendReservationEmail, sendDeclineReservationEmail, sendUserReservationEmail ,sendUserDeclinedReservationEmail} from '../controllers/mailling.controller.js';
import { findOneAppartByFilter } from '../controllers/apartment.controller.js';
import { createCustomer, addCard, httpMakePayment, createCheckoutSession } from '../controllers/stripePayment.controller.js';
import { updateBookedDates } from "../controllers/apartment.controller.js";
import { createNotification } from '../controllers/notification.controller.js';
import dotenv from 'dotenv';
import { STATE } from '../models/reservation.enums.js';

/* Accessing .env content */
dotenv.config();

const stripe = new Stripe(process.env.SECRET_KEY, {
   apiVersion: '2020-08-27',
});
export async function httpGetMyReservations(req, res) {
   console.log(req.user);

   try {
      const foundUser = await userDb.findOne(req.user);
      if (!foundUser) {
         return res.status(404).json({ error: 'User not found!' });
      }

      const reservations = await reservationDb
         .find()
         .populate({
            path: 'Order',
            populate: [
               { path: 'User', model: 'User' },
               { path: 'appartment', model: 'Appartment',
            
               populate: { path: 'services', model: 'Service' }
            },
            { path: 'services', model: 'Service' }
             ]
         })
         .populate('Card');

      const filteredReservations = reservations.filter(reservation => {
         if (!reservation.Order || !reservation.Order.User) {
            return false;
         }
         return reservation.Order.User.id === foundUser.id;
      });

      res.status(200).json(reservationListFormat(filteredReservations));
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
   }
}

export function httpGetMyOrders(req, res) {
   console.log(req.user);
   findOneUserByFilter(req.user.id)
      .then((foundUser) => {
         if (!foundUser) {

            return res.status(404).json({ error: 'User not found!' });
         } else {
            orderDb
               .find({
                  User: foundUser,
               }).populate('appartment').populate('User')
               .then((orders) => {
                  res.status(200).json(orderListFormat(orders));
               })
               .catch((err) => res.status(500).json({ error: err.message }));

         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}

export function httpGetOneReservation(req, res) {

   findOneReservationByFilter(req.params.param).populate('Order').populate('Card')
      .then((foundReservation) => {
         if (!foundReservation) {

            return res.status(404).json({ error: 'Reservation not found!' });
         } else {

            res.status(200).json(reservationFormat(foundReservation));


         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}


export function httpGetOneOrder(req, res) {

   findOneOrderByFilter(req.params.param)
      .then((foundOrder) => {
         if (!foundOrder) {

            return res.status(404).json({ error: 'Order not found!' });
         } else {

            res.status(200).json(orderFormat(foundOrder));


         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}


///Create Order

export function httpCreateOrder(req, res) {
   if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ error: validationResult(req).array() });
   }

   const user = req.user;
   const newOrder = req.body;


   userDb.findOne({ email: user.email })
      .then((foundUser) => {
         if (!foundUser) {
            return res.status(404).json({ message: 'User not found!' });
         }


         newOrder.User = foundUser;
         console.log("appartment id : " + req.body.appartment);
         findOneAppartByFilter(req.body.appartment)
            .then(async (foundAppartment) => {

               if (!foundAppartment) {
                  return res.status(404).json({ message: 'Appartment not found!' });
               }

               newOrder.appartment = foundAppartment;
               ///newOrder.code = generateRandomCode(6);
               console.log(newOrder.appartment);

               // Call payment function to make payment


               const serviceIds = newOrder.services;

               const services = await serviceDb.find({
                  _id: { $in: serviceIds } // Find all services with IDs in the serviceIds array
               });

               console.log("services found : " + services);

               newOrder.services = services;

               orderDb.create(newOrder)
                  .then((result) => {
                     res.status(201).json(orderFormat(result));


                  })
                  .catch((err) => res.status(500).json({ error: err.message }));
            })
            .catch((err) => res.status(500).json({ error: err.message }));
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}

//*********************************Create a reservation**************************************/

export function httpCreateReservation(req, res) {
   if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ error: validationResult(req).array() });
   }

   const user = req.user;

   const order = req.body.Order;

   var newReservation = new reservationDb();

   console.log("total price :" + order.totalPrice);

   userDb.findOne({ email: user.email })
      .then((foundUser) => {
         if (!foundUser) {
            return res.status(404).json({ message: 'User not found!' });
         }
         newReservation.code = generateRandomCode(6);
         findOneOrderByFilter(order.id).then((order) => {
            var resOrder = order;

            resOrder.User = foundUser;
            newReservation.Order = resOrder;

         })





         if (order.isConfirmed === false) {
            return res.status(400).json({ message: 'Order is not confirmed' });
         }
         // Call payment function to make payment
         createCustomer(foundUser)
            .then((customerId) => {
               const cardDetails = req.body.Card;


               if (!cardDetails.number || !cardDetails.exp_month || !cardDetails.exp_year || !cardDetails.cvc) {
                  return res.status(400).json({ error: 'Card details are incomplete' });
               }

               var usercard = new cardM({

                  number: cardDetails.number,
                  exp_month: cardDetails.exp_month,
                  exp_year: cardDetails.exp_year,
                  cvc: cardDetails.cvc,


               });

               usercard.save().then((savedcard) => {

                  newReservation.Card = savedcard;

                  stripe.tokens.create(
                     {

                        card: {

                           number: cardDetails.number,
                           exp_month: cardDetails.exp_month,
                           exp_year: cardDetails.exp_year,
                           cvc: cardDetails.cvc,
                        },
                     },
                     function (err, token) {

                        if (err) {
                           return res.status(500).json({ error: err.message });
                        }
                        console.log(token);
                        addCard(customerId, token.id)
                           .then((card) => {
                              console.log(card);
                              // Check if the card is not null before creating the payment intent
                              if (card) {

                                 stripe.paymentMethods.create({
                                    type: 'card',
                                    card: {
                                       number: cardDetails.number,
                                       exp_month: cardDetails.exp_month,
                                       exp_year: cardDetails.exp_year,
                                       cvc: cardDetails.cvc,
                                    },

                                 },


                                 ).then((paymentMethod) => {

                                    stripe.paymentMethods.attach(paymentMethod.id, {
                                       customer: customerId,
                                    }).then((payment_method) => {

                                       findOneOrderByFilter(order.id).then((orderfound) => {

                                          httpMakePayment(req, res, orderfound.totalPrice, customerId, newReservation._id, paymentMethod.id, order.id)
                                             .then((paymentIntent) => {



                                                reservationDb.create(newReservation)
                                                   .then((result) => {
                                                      orderDb.findByIdAndUpdate(order.id, {
                                                         $set: {
                                                            isPaied: true
                                                         },
                                                      }).then((orderF) => {
                                                         console.log(orderF);

                                                         findOneReservationByFilter(result._id);
                                                         console.log(newReservation.Order.checkIn);
                                                         console.log(newReservation.Order.checkOut);
                                                         
                                                             updateBookedDates(newReservation.Order.appartment.id, newReservation.Order.checkIn, newReservation.Order.checkOut, res);
                                                         
                                                         sendUserReservationEmail(foundUser, newReservation, newReservation.Order.totalPrice);


                                                         // Create notification for the user
                                                         const notification = {
                                                            user: foundUser._id,
                                                            message: 'You have made a reservation for the ' + newReservation.Order.appartment.name + ' , reservation code : ' + newReservation.code,
                                                         };
                                                         console.log('Debuging order state : ' + orderF.state);
                                                         createNotification(notification)
                                                            .catch((err) => console.error(err));

                                                      }).catch((err) => res.status(500).json({ error: err }));

                                                   })
                                                   .catch((err) => res.status(500).json({ error: err }));
                                             })
                                             .catch((error) => res.status(500).json({ error: error.message }));


                                       }).catch((error) => res.status(500).json({ error: error.message }));





                                    });





                                 })


                              } else {
                                 return res.status(400).json({ error: 'No card found for the customer.' });
                              }
                           })
                           .catch((error) => res.status(500).json({ error: error.message }));
                     }
                  );

               }).catch((error) => res.status(500).json({ error: error.message }));



            })
            .catch((error) => res.status(500).json({ error: error.message }));

      })
      .catch((err) => res.status(500).json({ error: err.message }));
}



//*********************************Create a reservation paypal**************************************/

export async function httpCreateReservationPaypal(order, req, res) {
   try {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ error: errors.array() });
     }
 
     const foundUser = await userDb.findById(order.User);
     if (!foundUser) {
       return res.status(404).json({ message: 'User not found!' });
     }
 
     const newReservation = new reservationDb();
     newReservation.code = generateRandomCode(6);
 
     const orderResult = await findOneOrderByFilter(order.id);
     orderResult.isPaied=true;
     await  orderResult.save();
     const resOrder = orderResult;
 
     resOrder.User = foundUser;
     newReservation.Order = resOrder;
 
     if (order.state=="PENDING"||order.state=="DECLINED") {
       return res.status(400).json({ message: 'Order is not confirmed' });
     }
     newReservation.paied=true;
     await reservationDb.create(newReservation);
 
     await orderDb.findByIdAndUpdate(order.id, { $set: { isPaied: true } });
 
     const result = await findOneReservationByFilter(newReservation._id);
 
     updateBookedDates(newReservation.Order.appartment.id, newReservation.Order.checkIn, newReservation.Order.checkOut, res);
     sendUserReservationEmail(foundUser, newReservation, newReservation.Order.totalPrice);
 
     const notification = {
       user: foundUser._id,
       message: 'You have made a reservation for ' + newReservation.Order.appartment.name + ', reservation code: ' + newReservation.code,
     };
 
     await createNotification(notification);
 
     res.status(200).json({ message: 'Reservation created successfully!' });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 }


















async function AddServicesToOrder(req, res, Order, services) {

   if (!validationResult(req).isEmpty()) {
      res.status(400).json({ error: validationResult(req).array() });
   } else {


      orderDb
         .findByIdAndUpdate(
            Order._id,
            {
               $pushAll: {
                  services: services,
               },

            },
            { new: true }
         ).then((register) => {
            res.status(201).json(orderFormat(register));
         })
         .catch((err) => res.status(500).json({ error: err.message }));
   }




}



export function httpDeclineOrder(req, res) {
   const user = req.user;

   findOneOrderByFilter(req.params.param)
      .then((foundOrder) => {
         if (!foundOrder) {
            res.status(404).json({ error: 'Reservation not found!' });
         } else {

            console.log("found user : " + foundOrder.User._id);
            console.log("param user : " + user.id);
            if (user.id == foundOrder.User._id) {
               orderDb
                  .findByIdAndDelete(foundOrder._id)
                  .then((result) => {
                     ///// creating the decline notification
                     const notification = {
                        user: user.id,
                        message: 'You have declined the reservation for :' + foundOrder.appartment.name + " reservation code : " + foundOrder.id,
                     };

                     createNotification(notification);
                     res.status(200).json({
                        message: `${foundOrder.id} delclined successfully`,
                     });
                  })
                  .catch((err) => res.status(500).json({ error: err.message }));
            } else {
               res.status(500).json({ error: 'User does not correspond to the reservation' });

            }

         }
      })
      .catch((err) => res.status(500).json({ error: err }));
}

export function httpAdminDeclineOrder(req, res) {
   findOneOrderByFilter(req.params.param)
      .then((foundOrder) => {
         if (!foundOrder) {
            return res.status(404).json({ message: 'Order not found!' });
         } else {
            if (foundOrder.state === "ACCEPTED" || foundOrder.state === 'DECLINED') {
               return res.status(400).json({
                  message: 'Order already accepted or declined!',
               });
            } else {
               orderDb
                  .updateOne(
                     { _id: foundOrder._id },
                     { $set: { accepted: false, state: "DECLINED" } }
                  )
                  .then((order) => {

                     sendDeclineReservationEmail(foundOrder.User, foundOrder, foundOrder.appartment)
                     const notification = {
                        user: foundOrder.User._id,
                        message: `Your reservation for ${foundOrder.appartment.name} (reservation code: ${foundOrder.id}) has been declined by our admin.`,
                     };
                     createNotification(notification);

                     res.status(200).json({
                        message: `${foundOrder.id} declined successfully`,
                     });
                  })
                  .catch((err) => res.status(500).json({ error: err.message }));
            }
         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}

export function httpUserDeclineOrder(req, res) {
   findOneOrderByFilter(req.params.param)
     .then((foundOrder) => {
       if (!foundOrder) {
         return res.status(404).json({ message: 'Order not found!' });
       } else {
         if (foundOrder.state === 'ACCEPTED' || foundOrder.state === 'DECLINED') {
           return res.status(400).json({
             message: 'Order already accepted or declined!',
           });
         } else {
           orderDb
             .deleteOne({ _id: foundOrder._id })
             .then(() => {
               sendUserDeclinedReservationEmail(foundOrder.User, foundOrder, foundOrder.appartment);
 
               const notification = {
                 user: foundOrder.User._id,
                 message: `Your reservation for ${foundOrder.appartment.name} (reservation code: ${foundOrder.id}) has been declined sucessfully.`,
               };
               createNotification(notification);
 
               res.status(200).json({
                 message: `${foundOrder.id} declined and deleted successfully`,
               });
             })
             .catch((err) => res.status(500).json({ error: err.message }));
         }
       }
     })
     .catch((err) => res.status(500).json({ error: err.message }));
 }

export function httpAdminAcceptOrder(req, res) {

   findOneOrderByFilter(req.params.param)
      .then((foundOrder) => {
         if (!foundOrder) {
            return res.status(404).json({ message: 'Order not found!' });
         } else {

            if (foundOrder.state == "ACCEPTED" || foundOrder.state == 'DECLINED') {
               return res.status(400).json({
                  message: ' Order already accepted or declined',
               });
            } else {

               orderDb
                  .findByIdAndUpdate(foundOrder._id, {
                     $set: {
                        accepted: true,
                        state: "ACCEPTED",
                     },
                  })
                  .then((result) => {
                     userDb
                        .findById(foundOrder.User._id)
                        .then((founUser) => {
                           sendReservationEmail(founUser, foundOrder);

                           res.status(200).json({
                              message: `${foundOrder.id} accepted successfully`,
                           });
                        }

                        )
                        .catch((err) =>
                           res.status(500).json({
                              error: err.message,
                           })
                        );


                  }

                  )
                  .catch((err) =>
                     res.status(500).json({ error: err.message })
                  );

            }

         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));


}
///get booked dates
export async function getAcceptedBookings(req, res) {
   const apartment = await appartmentDb.findById(req.params.param)

   const acceptedOrders = await orderDb.find({ appartment: apartment.id, state: STATE.ACCEPTED });
   if (acceptedOrders == null) {

      res.status(404).json({ error: "No accepted orders !" });
   } else {

      const bookedDates = acceptedOrders.map(order => {
         const { checkIn, checkOut } = order;
         return { start: checkIn, end: checkOut };
      });

      res.status(200).json(bookedDates);

   }

}


//get all reservations
export function httpGetAllReservations(req, res) {
   reservationDb
      .find().populate('Order').populate('Card')
      .then((reservations) => {
         res.status(200).json(reservationListFormat(reservations));
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}
export async function httpGetAllOrdersForUser(req, res) {
   try {
      const userId = req.user.id;
      console.log(userId);

      const orders = await orderDb
         .find({ User: userId })
         .populate({
            path: "appartment",
            populate: { path: "services", model: "Service" },
         })
         .populate("User").populate("services");

      if (!orders || orders.length === 0) {
         return res.status(404).json({ error: "No orders found for this user!" });
      }

      res.status(200).json(orderListFormat(orders));
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
   }
}



export function httpGetAllOrders(req, res) {
   orderDb
      .find().populate('appartment').populate('User')
      .then((orders) => {
         res.status(200).json(orderListFormat(orders));
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}

export async function findOneReservationByFilter(reservationFilter) {
   var reservationtId = null;
   if (mongoose.Types.ObjectId.isValid(reservationFilter)) {
      reservationtId = reservationFilter;
   }
   return await reservationDb.findOne({
      $or: [
         { _id: reservationtId },
         { code: reservationFilter },
         { Order: reservationFilter },
      ],
   });
}

export async function findOneOrderByFilter(orderFilter) {
   var orderId = null;
   if (mongoose.Types.ObjectId.isValid(orderFilter)) {
      orderId = orderFilter;
   }
   return await orderDb.findOne({
      $or: [
         { _id: orderId },

         { User: orderFilter },

      ],
   }).populate('appartment').populate('User');
}

function orderFormat(Order) {
   return {
      id: Order._id,

      description: Order.description,
      totalPrice: Order.totalPrice,
      checkIn: Order.checkIn,
      checkOut: Order.checkOut,

      servicesFee: Order.servicesFee,
      nightsFee: Order.nightsFee,
      isPaied: Order.isPaied,
      state: Order.state,
      services: Order.services,
      User: Order.User,
      appartment: Order.appartment,
      transactionId: Order.transactionId
   };
}

export function orderListFormat(orders) {
   let foundOrders = [];
   orders.forEach((order) => {
      foundOrders.push(orderFormat(order));
   });
   return foundOrders;
}

function reservationFormat(reservation) {
   return {
      id: reservation._id,
      Card: reservation.Card,
      code: reservation.code,
      transactionId: reservation.transactionId,
      paied: reservation.paied,
      Order: reservation.Order
   };
}
export function reservationListFormat(reservations) {
   let foundReservations = [];
   reservations.forEach((reservation) => {
      foundReservations.push(reservationFormat(reservation));
   });
   return foundReservations;
}

function generateRandomCode(length) {
   var result = '';
   var characters = '0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
         charactersLength));
   }
   return result;
}




function calculateOrderTotalFee(order) {
   const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

   const checkIn = new Date(order.checkIn);
   const checkOut = new Date(order.checkOut);
   const nights = Math.round((checkOut - checkIn) / millisecondsPerDay); // Number of nights

   const nightsFee = nights * order.nightsFee;
   const servicesFee = nights * order.servicesFee;
   const totalPrice = nightsFee + servicesFee;

   return totalPrice;
}