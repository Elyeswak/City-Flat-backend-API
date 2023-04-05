import mongoose from 'mongoose';
import notificationDb from '../models/notification.model.js';
import appartmentDb from '../models/appartment.model.js';
import userDb from '../models/user.model.js';
import { validationResult } from 'express-validator';
import { findOneUserByFilter, userFormat } from '../controllers/user.controller.js';
import Notification from "../models/notification.model.js";

// create notification
const createNotification = async (notification) => {
  const newNotification = new Notification(notification);
  return await newNotification.save();
};

// get all notifications for a user
const getAllNotificationsForUser = async (userId) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

//getone
const getNotificationByIdForUser = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({ _id: notificationId, user: userId });
    if (!notification) {
      throw new Error(`Notification ${notificationId} not found for user ${userId}`);
    }
    return notification;
  } catch (err) {
    console.error(`Error getting notification ${notificationId} for user ${userId}:`, err);
    throw err;
  }
};
// mark all notifications as read for a user
const markAllNotificationsAsReadForUser = async (userId) => {
  await Notification.updateMany({ user: userId }, { read: true });
};

const markNotificationAsReadForUser = async (notificationId, userId) => {
  try {
    await Notification.updateOne({ _id: notificationId, user: userId }, { read: true });
    console.log(`Notification ${notificationId} marked as read for user ${userId}`);
  } catch (err) {
    console.error(`Error marking notification ${notificationId} as read for user ${userId}:`, err);
  }
};

// delete all notifications for a user
const deleteAllNotificationsForUser = async (userId) => {
  await Notification.deleteMany({ user: userId });
};

// delete a notification by ID
const deleteNotificationById = async (notificationId) => {
  await Notification.findByIdAndDelete(notificationId);
};

// update a notification by ID
const updateNotificationById = async (notificationId, updatedNotification) => {
  return await Notification.findByIdAndUpdate(notificationId, updatedNotification, {
    new: true,
  });
};


export function notificationListFormat(notifications) {
  let foundNotifs = [];
  notifications.forEach((notif) => {
     foundNotifs.push(notificationFormat(notif));
  });
  return foundNotifs;
}


export function notificationFormat(notification) {
  return {
     id: notification._id,
     message: notification.message,
     read: notification.read,
     readAt: notification.readAt,

  };
}

export {
  createNotification,
  getAllNotificationsForUser,
  markAllNotificationsAsReadForUser,
  deleteAllNotificationsForUser,
  deleteNotificationById,
  updateNotificationById,
  markNotificationAsReadForUser,
  getNotificationByIdForUser,
};












// export async function  SendNotification(req,res,reservation){

    
//     let newNotification = {
//         User : reservation.User,
//         code :reservation.code,
//         name : "",
//         description : ""
//     };
//     if(reservation.state == "PENDING")
//     {
//         newNotification.name = "PENDING RESERVATION"
//         newNotification.description="Your reservation is being reviewed by an admin."
//     }
//     if(reservation.state == "ACCEPTED")
//     {
//         newNotification.name = "RESERVATION CONFIRMED"
//         newNotification.description="Your reservation has been confirmed."

//     }
//     else
//     {
//         newNotification.name = "RESERVATION DECLINED"
//         newNotification.description="Your reservation has been declined."

//     }
//     userDb
//     .findByIdAndUpdate(newNotification.User._id, {
//        $push: {
//           notifications:newNotification
//        },
//     })
//     .then((result) =>{
       

//     res.status(200).json({
//        message: `Notification sent`,
//     });
//     }

//     )
//     .catch((err) =>
//     res.status(500).json({
//        error: err.message,
//     })
//     );
      
      
 
//  }

//  export async function  AdminSendNotification(req,res,reservation){

    
//     let newNotification = {
//         User : reservation.User,
//         code :reservation.code,
//         name : "",
//         description : ""
//     };
    
//         newNotification.name = "PENDING RESERVATION"
//         newNotification.description=reservation.User._id+" 's reservation is pending , awaiting your confirmation ,code : "
//         + reservation.code
//     findOneUserByFilter(newNotification.User._id)
//     if(reservation.User.role == "ADMIN")
//     {
//     userDb
//     .findByIdAndUpdate(newNotification.User._id, {
//        $push: {
//           notifications:newNotification
//        },
//     })
//     .then((result) =>{
       
//         return result
//     }


//     )
//     .catch((err) =>
//     res.status(500).json({
//        error: err.message,
//     })
//     );
// }
      
      
 
//  }