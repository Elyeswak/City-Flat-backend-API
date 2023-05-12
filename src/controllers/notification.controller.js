import mongoose from 'mongoose';
import notificationDb from '../models/notification.model.js';
import appartmentDb from '../models/appartment.model.js';
import userDb from '../models/user.model.js';
import { validationResult } from 'express-validator';
import { findOneUserByFilter, userFormat } from '../controllers/user.controller.js';


// create notification
const createNotification = async (notification) => {
  const newNotification = new notificationDb(notification);
  return await newNotification.save();
};
// get all notifications for a user
const getAllNotificationsForUser = async (userId) => {

  return await notificationDb.find({ user: userId }).sort({ createdAt: -1 });
};

export async function getNotificationsForUser(req, res) {
  try {
    const userId = req.user.id;
 
    const notifications = await getAllNotificationsForUser(userId);
    
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ error: 'No notifications found for this user!' });
    }

    res.status(200).json(notificationListFormat(notifications));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

 async function getNotificationForUser(req, res) {
  try {
    const userId = req.user.id;
    const notificationId = req.params.param;
    
    const notification = await getNotificationByIdForUser(notificationId, userId);
    res.status(200).json(notificationFormat(notification));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

//getone
 const getNotificationByIdForUser = async (notificationId, userId) => {
  try {
    const notification = await notificationDb.findById(notificationId);
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
  await notificationDb.updateMany({ user: userId }, { read: true });
};

export async function markAllNotificationsAsRead(req, res) {
  try {
    const userId = req.user.id;

    await markAllNotificationsAsReadForUser(userId);

    res.status(200).json({ message: 'All notifications marked as read for user.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
}
async function markNotificationAsReadForUser (req,res){
  var notificationId=req.params.param;
  try {
    await notificationDb.updateOne({ _id: notificationId},{$set:  { read: true }}).then((updated)=>{
if(updated){
  console.log(updated);
  res.status(200).json(updated);
}
    
    });
    
  } catch (err) {
    res.status(500).json({message:err.message});
  }
};

// delete all notifications for a user
async function deleteAllNotificationsForUser(req, res) {
  const userId = req.user.id;

  try {
    const result = await notificationDb.deleteMany({ user: userId });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
// delete a notification by ID
async function deleteNotificationById(req,res) {
  var notificationId= req.params.param;
  await notificationDb.findByIdAndDelete(notificationId).then((value)=>{

if(value){

  res.status(200).json(value);
}

  }).catch((err)=>{

    res.status(500).json({message:err.message});
  });
};

// update a notification by ID
const updateNotificationById = async (notificationId, updatedNotification) => {
  return await notificationDb.findByIdAndUpdate(notificationId, updatedNotification, {
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
  getNotificationForUser,
  markAllNotificationsAsReadForUser,
  deleteAllNotificationsForUser,
  deleteNotificationById,
  updateNotificationById,
  markNotificationAsReadForUser,
 
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