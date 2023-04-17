import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { STATE } from "../models/reservation.enums.js";
const ReservationSchema = new Schema({

    Order:{ type: Schema.Types.ObjectId, ref: 'Order' },
    Card:{ type: Schema.Types.ObjectId, ref: 'UserCard' },
  
 code: {
        type: String,
        unique: true,
       
      },
 

  paied:  {

    type:Boolean,
    default:false,
  },
      transactionId:{
        type:String,
       },
    
},
{ timestamps: true }
);

//ReservationSchema.index({createdAt: 1},{expireAfterSeconds:2592000});

export default model("Reservation", ReservationSchema);