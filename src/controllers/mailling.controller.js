import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import userDb from '../models/user.model.js';
import { findOneUserByFilter } from './user.controller.js';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const emailTemplateSource = fs.readFileSync(
   path.join(__dirname, '../public/templates/email.hbs'),
   'utf8'
);
const emailReservationTemplateSource = fs.readFileSync(
   path.join(__dirname, '../public/templates/emailReservation.hbs'),
   'utf8'
);
const emailDeclineReservationTemplateSource = fs.readFileSync(
   path.join(__dirname, '../public/templates/emailReservation_decline.hbs'),
   'utf8'
);

export function httpVerifyEmail(req, res) {
   const { verificationCode } = req.body;
   findOneUserByFilter(req.params.param)
      .then((foundUser) => {
         if (!foundUser) {
            return res.status(404).json({ message: 'User not found!' });
         } else {
            bcrypt
               .compare(
                  verificationCode.toString(),
                  foundUser.verificationCode
               )
               .then((valid) => {
                  if (!valid) {
                     return res.status(400).json({
                        message: 'Verification code is incorrect',
                     });
                  } else {
                     if (foundUser.isVerified) {
                        return res.status(400).json({
                           message: 'User is already verified',
                        });
                     } else {
                        userDb
                           .findByIdAndUpdate(foundUser._id, {
                              $set: {
                                 isVerified: true,
                              },
                           })
                           .then((result) =>
                              res.status(200).json({
                                 message: `${foundUser.name} verified successfully`,
                              })
                           )
                           .catch((err) =>
                              res.status(500).json({ error: err.message })
                           );
                     }
                  }
               });
         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}
export function httpResetPasswordByEmail(req, res) {
    findOneUserByFilter(req.params.param)
      .then((foundUser) => {
         if (!foundUser) {
            return res.status(404).json({ message: 'User not found!' });
         } else {
            sendResetPasswordEmail(foundUser);
            userDb
               .updateOne(
                  { _id: foundUser._id },
                  { $set: { password: foundUser.password } }
               )
               .then((result) => {
                  res.status(200).json({
                     message: `${foundUser.name} password reset successfully`,
                  });
               })
               .catch((err) => res.status(500).json({ error: err.message }));
         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}
export function httpResendVerificationEmail(req, res) {
    findOneUserByFilter(req.params.param)
      .then((foundUser) => {
         if (!foundUser) {
            return res.status(404).json({ message: 'user not found!' });
         } else if (foundUser.isVerified) {
            return res.status(400).json({
               message: 'user is already verified',
            });
         } else {
            sendVerificationEmail(foundUser);
            userDb
               .updateOne(
                  { _id: foundUser._id },
                  {
                     $set: {
                        verificationCode: foundUser.verificationCode,
                     },
                  }
               )
               .then((result) => {
                  return res.status(200).json({
                     message: `${foundUser.name} verification email resent successfully`,
                  });
               })
               .catch((err) => res.status(500).json({ error: err.message }));
         }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
}
export function sendVerificationEmail(user) {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD,
      },
   });
   var verificationCode = Math.floor(Math.random() * 9000) + 1000;
   user.verificationCode = bcrypt.hashSync(verificationCode.toString(), 10);

   const template = handlebars.compile(emailTemplateSource);
   const title = 'CityFlat Account Verification';
   const message = `Hi there ${user.username}, We're excited to have you get started.
First, you need to confirm your account. Just copy
the code below and paste it inside our CityFlat App`;

   const htmlToSend = template({
      title: title,
      message: message,
      code: verificationCode,
   });
   const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'CityFlat Email Verification',
      html: htmlToSend,
   };
   transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
         console.log(err);
      } else {
      }
      console.log(`Email sent to ${user.email} successfully`);
   });
}

export function sendReservationEmail(user,reservation) {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD,
      },
   });
  

   const template = handlebars.compile(emailReservationTemplateSource);
   const title = 'CityFlat Reservation feedback';
   const message = `Hi there ${user.username}, We're excited to inform you that your reservation is accepted for ${reservation.appartment.name}.
your reservation code is : ${reservation.code}.
check your CityFlat App`;

   const htmlToSend = template({
      title: title,
      message: message,
      code: reservation.code,
   });
   const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'CityFlat Reservation feedback',
      html: htmlToSend,
   };
   transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
         console.log(err);
      } else {
      }
      console.log(`Email sent to ${user.email} successfully`);
   });
}

export function sendDeclineReservationEmail(user,reservation,appartment) {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD,
      },
   });
  

   const template = handlebars.compile(emailReservationTemplateSource);
   const title = 'CityFlat Reservation feedback';
   const message = `Hi there ${user.name}, We're terribly sorry to inform you that your reservation is declined for ${appartment.name}.
 reservation code is : ${reservation.code}.
check your CityFlat App`;

   const htmlToSend = template({
      title: title,
      message: message,
      code: reservation.code,
   });
   const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'CityFlat Reservation feedback',
      html: htmlToSend,
   };
   transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
         console.log(err);
      } else {
      }
      console.log(`Email sent to ${user.email} successfully`);
   });
}


function sendResetPasswordEmail(user) {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD,
      },
   });
   var newPassword = Math.floor(Math.random() * 900000) + 1000;
   user.password = bcrypt.hashSync(newPassword.toString(), 10);
   const template = handlebars.compile(emailTemplateSource);
   const title = 'Reset Password';
   const message = `Hi there ${user.name}, you'll find down below your new password.
   Please don't share it with anyone. We'd recommend you to change it after you login.`;

   const htmlToSend = template({
      title: title,
      message: message,
      code: newPassword,
   });
   const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'CityFlat [Reset Password]',
      html: htmlToSend,
   };
   transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
         console.log(err);
      } else {
         console.log(`Email sent to ${user.email} successfully`);
      }
   });
}
