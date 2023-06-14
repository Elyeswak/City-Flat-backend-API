import express from 'express';
import{
    createHelpMessage,
    getHelpMessageById,
    getAllHelpMessages,
    deleteHelpMessage,



}from "../controllers/HelpMessage.controller.js";
import { ensureAdmin, ensureUser } from '../middlewares/authorization-handler.js';

 /** Defining the router */
 const HelpRouter = express.Router();

//create
 HelpRouter
 .route('/messages/sendmessage')
    .post(ensureUser,createHelpMessage);
//getall 
 HelpRouter
 .route('/messages/getall')
    .get(ensureAdmin,getAllHelpMessages);

//getone
//delete one
    HelpRouter
    .route('/messages/getDel/:param')
       .get(getHelpMessageById)
       .delete(ensureAdmin,deleteHelpMessage);


      

 export { HelpRouter };