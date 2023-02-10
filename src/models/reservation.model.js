import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { STATE } from "../models/reservation.enums.js";
const ReservationSchema = new Schema({
  
    User:{ type: Schema.Types.ObjectId, ref: 'User' },
    appartment:{ type: Schema.Types.ObjectId, ref: 'Appartment' },
    description: { type: String, required: true},
   
    totalPrice: {
        type: Number,
        required: true
    },

    checkIn: { type: Date,required: true },
    checkOut: { type: Date, required: true},
    code:{
        type:String,
        required: true,
        unique: true,
    },
    servicesFee: {
        type: Number,
        required: true
    },
    nightsFee: {
        type: Number,
        required: true
    },
    
    accepted: {
        type: Boolean,
        required: true,
        default: false,
    },

    state: {
        type: String,
        enum: [STATE.PENDING, STATE.ACCEPTED,STATE.DECLINED],
        default: STATE.PENDING,
      },

    services: [{ type: Schema.Types.Array, ref: 'Service', required: false, }],
  
    
    
},
{ timestamps: true }
);



export default model("Reservation", ReservationSchema);