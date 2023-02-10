import mongoose from 'mongoose';
import reservationDb from '../models/reservation.model.js';
import appartmentDb from '../models/appartment.model.js';
import userDb from '../models/user.model.js';
import { validationResult } from 'express-validator';
import { findOneUserByFilter, userFormat } from '../controllers/user.controller.js';
import {sendReservationEmail,sendDeclineReservationEmail} from '../controllers/mailling.controller.js';
import {SendNotification,AdminSendNotification} from '../controllers/notification.controller.js';


export function httpGetMyReservations(req, res) {
   console.log(req.user);
   findOneUserByFilter(req.user.id)
      .then((foundUser) => {
         if (!foundUser) {

            return res.status(404).json({ error: 'User not found!' });
         } else {
            reservationDb
               .find({
                  User: foundUser,
               })
               .then((reservations) => {
                  res.status(200).json(reservationListFormat(reservations));
               })
               .catch((err) => res.status(500).json({ error: err.message }));

         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}


export function httpCreateReservation(req, res) {
   if (!validationResult(req).isEmpty()) {
      res.status(400).json({ error: validationResult(req).array() });
   } else {
      const user = req.user;
      const newReservation = req.body;

      userDb
         .findOne({ email: user.email })
         .then((founduser) => {
            if (!founduser) {
               return res.status(404).json({
                  message: 'User not found!',
               });
            } else {

               const appartment = req.body.appartment;
               console.log(founduser);
               newReservation.User = founduser;
              
                     
               appartmentDb
                  .findOne({ name: appartment.name })
                  .then((appartment) => {
                     if (!appartment) {
                        return res.status(404).json({
                           message: 'Appartment not found!',
                        });
                     } else {



                        newReservation.appartment = appartment;
                        newReservation.code = generateRandomCode(6);
                        
                        reservationDb
                           .create(newReservation)
                           .then((result) => {
                              findOneReservationByFilter(result._id)
                                 .then((register) => {
                                    console.log(AdminSendNotification(req,res,newReservation));
                                    res.status(201).json(reservationFormat(register));
                                    
                                    

                                 }

                                    //    userDb
                                    //    .findByIdAndUpdate(
                                    //     founduser.id,
                                    //     {
                                    //        $pushAll: {
                                    //          reservations: newReservation,
                                    //        },

                                    //     },
                                    //     { new: true }
                                    //  ).then((result) => {
                                    //    
                                    //  })
                                    //  .catch((err) => res.status(500).json({ error: err.message }));



                                 )
                                 .catch((err) =>
                                    res.status(500).json({ error: err.message })
                                 );


                           })
                           .catch((err) => res.status(500).json({ error: err.message }));




                     }
                  })
                  .catch((err) => res.status(500).json({ error: err.message }));



            }
         })
         .catch((err) => res.status(500).json({ error: err.message }));



   }
}


// export function httpDeclineReservation(req, res) {
//    const user = req.user;

//    userDb
//       .findOne({ email: user.email })
//       .then((founduser) => {
//          if (!founduser) {
//             return res.status(404).json({
//                message: 'User not found!',
//             });
//          } else {

//             findOneReservationByFilter(user)
//             .then((foundReservation) => {
//                if (!foundReservation) {
//                   res.status(404).json({ error: 'Reservation not found!' });
//                } else {
//                   reservationDb
//                      .findByIdAndDelete(foundReservation._id)
//                      .then((result) => {
//                         res.status(200).json({
//                            message: `${foundReservation.name} deleted successfully`,
//                         });
//                      })
//                      .catch((err) => res.status(500).json({ error: err.message }));
//                }
//             })
//             .catch((err) => res.status(500).json({ error: err.message }));


//          }
//       })
//       .catch((err) => res.status(500).json({ error: err.message }));


// }

export function httpDeclineReservation(req, res) {
   const user = req.user;
   //console.log(req.params.param);
   findOneReservationByFilter(req.params.param)
      .then((foundReservation) => {
         if (!foundReservation) {
            res.status(404).json({ error: 'Reservation not found!' });
         } else {
            
            console.log("found user : "+foundReservation.User._id);
            console.log("param user : "+user.id);
            if (user.id == foundReservation.User._id) {
               reservationDb
                  .findByIdAndDelete(foundReservation._id)
                  .then((result) => {
                     res.status(200).json({
                        message: `${foundReservation.code} delclined successfully`,
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

export function  httpAdminDeclineReservation(req, res){

  
   findOneReservationByFilter(req.params.param)
      .then((foundReservation) => {
         if (!foundReservation) {
            return res.status(404).json({ message: 'Reservation not found!' });
         } else {
            
                  if (foundReservation.accepted== true) {
                     return res.status(400).json({
                        message: ' reservation already accepted',
                     });
                  } else {
                     userDb
                        .findById(foundReservation.User._id)
                        .then((founUser) =>{

                           
                           appartmentDb
                           .findById(foundReservation.appartment._id)
                        .then((foundAppart) =>{

                        sendDeclineReservationEmail(founUser,foundReservation,foundAppart);
                        SendNotification(req,res,foundReservation);
                           reservationDb

                           .findByIdAndUpdate(foundReservation._id, {
                              $set: {
                                 accepted: false,
                                 state:"DECLINED",
                              },
                           })
                           .then((reservation) => {
                              
                         
                              res.status(200).json({
                                 message: `${foundReservation.code} delclined successfully`,
                              });
                           })
                           .catch((err) => res.status(500).json({ error: err.message }));


                        }).catch((err) => res.status(500).json({ error: err.message }));


                           
                        });
                   
                     
                     
                  }
               
         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
   
}



export function  httpAdminAcceptReservation(req, res){

   findOneReservationByFilter(req.params.param)
   .then((foundReservation) => {
      if (!foundReservation) {
         return res.status(404).json({ message: 'Reservation not found!' });
      } else {
         
               if (foundReservation.accepted== true) {
                  return res.status(400).json({
                     message: ' reservation already accepted',
                  });
               } else {
                   
                  reservationDb
                        .findByIdAndUpdate(foundReservation._id, {
                           $set: {
                              accepted: true,
                           },
                        })
                        .then((result) =>{
                           userDb
                     .findById(foundReservation.User._id)
                     .then((founUser) =>{
                        sendReservationEmail(founUser,foundReservation);

                        res.status(200).json({
                           message: `${foundReservation.code} accepted successfully`,
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



export async function findOneReservationByFilter(reservationFilter) {
   var reservationtId = null;
   if (mongoose.Types.ObjectId.isValid(reservationFilter)) {
      reservationtId = reservationFilter;
   }
   return await reservationDb.findOne({
      $or: [
         { _id: reservationtId },
         { code: reservationFilter },
         { User: reservationFilter },
         
      ],
   });
}

function reservationFormat(reservation) {
   return {
      id: reservation._id,
      description: reservation.description,
      totalPrice: reservation.totalPrice,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      code: reservation.code,
      servicesFee: reservation.servicesFee,
      nightsFee: reservation.nightsFee,
      accepted: reservation.accepted,
      services: reservation.services,
      User: reservation.User,
      appartment: reservation.appartment,
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
