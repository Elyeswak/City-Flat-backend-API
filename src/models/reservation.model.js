import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { STATE } from "../models/reservation.enums.js";
const ReservationSchema = new Schema({

    Order:{ type: Schema.Types.ObjectId, ref: 'Order' },
    Card:{ type: Schema.Types.ObjectId, ref: 'UserCard' },
    state: {
        type: String,
        enum: [STATE.PENDING, STATE.ACCEPTED,STATE.DECLINED],
        default: STATE.PENDING,
      },
 code: {
        type: String,
        unique: true,
       
      },
 

  
      transactionId:{
        type:String,
       },
    
},
{ timestamps: true }
);

//ReservationSchema.index({createdAt: 1},{expireAfterSeconds:2592000});

export default model("Reservation", ReservationSchema);