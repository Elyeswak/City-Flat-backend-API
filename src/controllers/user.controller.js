import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import userDb from '../models/user.model.js';
import { validationResult } from 'express-validator';
import { sendVerificationEmail } from './mailling.controller.js';




export function httpLoginUser(req, res) {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   userDb
      .findOne({ email: req.body.email })

      .then((user) => {
         if (!user) {
            return res.status(404).json({
               message: 'user not found!',
            });
         } else {


           if(user.isVerified == false) {
            return res.status(406).json({
               message: 'user not email not verified !',
            });
   }

            bcrypt
               .compare(req.body.password, user.password)
               .then((valid) => {
                  if (!valid) {
                     res.status(404).json({
                        message: 'Wrong email or password!',
                     });
                  } else {
                     userDb
                        .findById(user._id)
                        .then((login) =>
                           res.status(200).json(addTokenToUser(login))
                        )
                        .catch((err) =>
                           res.status(500).json({
                              error: err.message,
                           })
                        );
                  }
               })
               .catch((err) => res.status(500).json({ error: err.message }));
         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}


export function httpRegisterUser(req, res) {
   if (!validationResult(req).isEmpty()) {
      res.status(400).json({ error: validationResult(req).array() });
   } else {
      userDb
         .findOne({})
         .or([
            { name: req.body.name },
            { email: req.body.email },
         ])
         .then((exists) => {
            if (exists) {
               res.status(409).json({ message: 'User exists already!' });
            } else {
               const newUser = req.body;

               newUser.name = newUser.name;
               newUser.password = bcrypt.hashSync(req.body.password, 10);
              
               if(req.file){
                  newUser.img=req.file.path;
               }
                  userDb
                     .create(newUser)
                     .then((result) => {
                        findOneUserByFilter(result._id)
                           .then((register) => {
                              sendVerificationEmail(register);
                              userDb
                                 .updateOne(
                                    { name: register.name },
                                    {
                                       $set: {
                                          verificationCode:
                                             register.verificationCode,
                                       },
                                    }
                                 )
                                 .then((result) =>
                                    res.status(201).json(addTokenToUser(register))
                                 )
                                 .catch((err) =>
                                    res.status(500).json({ error: err.message })
                                 );
                           })
                           .catch((err) =>
                              res.status(500).json({ error: err.message })
                           );
                     })
                     .catch((err) => res.status(500).json({ error: err.message }));
            }
         })
         .catch((err) => res.status(500).json({ error: err.message }));
   }
}


export function httpGetAllUsers(req, res) {
   userDb
      .find()
      .then((users) => {
         res.status(200).json(usersListFormat(users));
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}

export function httpGetOneUser(req, res) {
   findOneUserByFilter(req.params.param)
      .then((foundUser) => {
         if (!foundUser) {
            res.status(404).json({ message: 'User not found!' });
         } else {
            res.status(200).json(userFormat(foundUser));
         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}

export function httpUpdateOneUser(req, res) {
   if (!validationResult(req).isEmpty()) {
      res.status(400).json({ error: validationResult(req).array() });
   } else {
      const newValues = req.body;
      delete newValues.password;

      findOneUserByFilter(req.params.param)
         .then((foundUser) => {
            if (!foundUser) {
               res.status(404).json({ message: 'User not found!' });
            } else {
             
               newValues.isBanned = foundUser.isBanned;
               userDb
                  .findByIdAndUpdate(foundUser._id, newValues)
                  .then((result) => {
                     userDb
                        .findById(result._id)
                        .then((updated) => {
                           res.status(200).json(userFormat(updated));
                        })
                        .catch((err) =>
                           res.status(500).json({ error: err.message })
                        );
                  })
                  .catch((err) => res.status(500).json({ error: err.message }));
            }
         })
         .catch((err) => res.status(500).json({ error: err.message }));
   }
}




//  export function httpUpdateAllPlayers(req, res) {
//     if (!validationResult(req).isEmpty()) {
//        res.status(400).json({ errors: validationResult(req).array() });
//     } else {
//        const newValues = req.body;
//        delete newValues.password;
//        playersDb
//           .updateMany({}, newValues)
//           .then((result) => {
//              playersDb
//                 .find({}, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
//                 .then((updatedPlayers) => res.status(200).json(updatedPlayers))
//                 .catch((err) => res.status(500).json({ error: err.message }));
//           })
//           .catch((err) => res.status(500).json({ error: err.message }));
//     }
//  }
export function httpDeleteOneUser(req, res) {
   findOneUserByFilter(req.params.param)
      .then((foundUser) => {
         if (!foundUser) {
            res.status(404).json({ error: 'User not found!' });
         } else {
            userDb
               .findByIdAndDelete(foundUser._id)
               .then((result) => {
                  res.status(200).json({
                     message: `${foundUser.name} deleted successfully`,
                  });
               })
               .catch((err) => res.status(500).json({ error: err.message }));
         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}

export function httpResetPassword(req, res) {
   const { oldPassword, newPassword } = req.body;
   findOneUserByFilter(req.params.param)
      .then((foundUser) => {
         if (!foundUser) {
            return res.status(404).json({ message: 'User not found!' });
         } else {
            if (bcrypt.compareSync(oldPassword, foundUser.password)) {
               const newPasswordHash = bcrypt.hashSync(newPassword, 10);
               userDb
                  .updateOne(
                     { _id: foundUser._id },
                     { $set: { password: newPasswordHash } }
                  )
                  .then((result) => {
                     res.status(200).json({
                        message: `${foundUser.name} password reset successfully`,
                     });
                  })
                  .catch((err) => res.status(500).json({ error: err.message }));
            } else {
               res.status(400).json({
                  message: `${foundUser.name} password reset failed`,
               });
            }
         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}
//************wishlist******************/
export async function addToWishlist(req, res) {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
 
   try {
      const userId = req.user.id;
    const  apartmentId = req.params.param;
 
     const user = await userDb.findById(userId);
     if (!user) {
       return res.status(404).json({ message: 'User not found' });
     }
 
     if (user.wishlist.includes(apartmentId)) {
       return res.status(400).json({ message: 'Apartment already in wishlist' });
     }
 
     user.wishlist.push(apartmentId);
     await user.save();
 
     res.status(200).json({ message: 'Apartment added to wishlist successfully' });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 }
//remove from wishlist 
 export function httpRemoveFromWishlist(req, res) {
   if (!validationResult(req).isEmpty()) {
     res.status(400).json({ error: validationResult(req).array() });
   } else {
     const  apartmentId  = req.params.param;
     const userId = req.user.id;
     userDb.findByIdAndUpdate(userId, { $pull: { wishlist: apartmentId } })
    .then(() => {
      res.status(200).json({ message: "Apartment removed from wishlist successfully!" });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
   }
 }

 //****list user wish list ******//

 export function httpListWishlist(req, res) {
   const userId = req.user.id;
   userDb.findById(userId)
     .populate('wishlist')
     .then((user) => {
       if (!user) {
         res.status(404).json({ error: 'User not found' });
       } else {
         const apartments = user.wishlist;
         res.status(200).json(apartments);
       }
     })
     .catch((err) => res.status(500).json({ error: err.message }));
 }
 
/**
 * A helper function that gets the user
 * with a given id or username or email
 * in the request body or as a param in the request uri
 */
export async function findOneUserByFilter(userFilter) {
   var userId = null;
   if (mongoose.Types.ObjectId.isValid(userFilter)) {
      userId = userFilter;
   }
   return await userDb.findOne({
      $or: [
         { _id: userId },
         { email: userFilter },
         { name: userFilter },
         { googleID: userFilter },
      ],
   });
}
//a function that adds jwt to user object


function addTokenToUser(user) {
   const payload = {
      user: {
         id: user._id,
    
         email: user.email,
         role: user.role,
      },
   };
   const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
   });
   const loggedUser = userFormat(user);
   loggedUser.token = token;
   return loggedUser;
}

function emailFormat(email) {
   const emailLowerCase = email.toLowerCase();
   const emailSplit = emailLowerCase.split('@');
   const name = emailSplit[0];
   const nameWithoutDots = name.replace(/\./g, '');
   return `${nameWithoutDots}@${emailSplit[1]}`;
}


export default function generateRandomPassword(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
  }
  return result;
}

export function usersListFormat(users) {
   let foundUsers = [];
   users.forEach((user) => {
      foundUsers.push(userFormat(user));
   });
   return foundUsers;
}
export function userFormat(user) {
   return {
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      number: user.number,
      address: user.address,
      isVerified: user.isVerified,
      birthdate: user.birthdate,
      role: user.role,
      isVerified: user.isVerified,
      img: user.img,
      reservations:user.reservations,
      googleID:user.googleID,
      stripeCustomerID:user.stripeCustomerID,
      wishlist:user.wishlist

   };
}






