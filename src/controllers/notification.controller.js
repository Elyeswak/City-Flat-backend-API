import mongoose from 'mongoose';
import notificationDb from '../models/notification.model.js';
import appartmentDb from '../models/appartment.model.js';
import userDb from '../models/user.model.js';
import { validationResult } from 'express-validator';
import { findOneUserByFilter, userFormat } from '../controllers/user.controller.js';


export async function  SendNotification(req,res,reservation){

    
    let newNotification = {
        User : reservation.User,
        code :reservation.code,
        name : "",
        description : ""
    };
    if(reservation.state == "PENDING")
    {
        newNotification.name = "PENDING RESERVATION"
        newNotification.description="Your reservation is being reviewed by an admin."
    }
    if(reservation.state == "ACCEPTED")
    {
        newNotification.name = "RESERVATION CONFIRMED"
        newNotification.description="Your reservation has been confirmed."

    }
    else
    {
        newNotification.name = "RESERVATION DECLINED"
        newNotification.description="Your reservation has been declined."

    }
    userDb
    .findByIdAndUpdate(newNotification.User._id, {
       $push: {
          notifications:newNotification
       },
    })
    .then((result) =>{
       

    res.status(200).json({
       message: `Notification sent`,
    });
    }

    )
    .catch((err) =>
    res.status(500).json({
       error: err.message,
    })
    );
      
      
 
 }

 export async function  AdminSendNotification(req,res,reservation){

    
    let newNotification = {
        User : reservation.User,
        code :reservation.code,
        name : "",
        description : ""
    };
    
        newNotification.name = "PENDING RESERVATION"
        newNotification.description=reservation.User._id+" 's reservation is pending , awaiting your confirmation ,code : "
        + reservation.code
    findOneUserByFilter(newNotification.User._id)
    if(reservation.User.role == "ADMIN")
    {
    userDb
    .findByIdAndUpdate(newNotification.User._id, {
       $push: {
          notifications:newNotification
       },
    })
    .then((result) =>{
       
        return result
    }


    )
    .catch((err) =>
    res.status(500).json({
       error: err.message,
    })
    );
}
      
      
 
 }