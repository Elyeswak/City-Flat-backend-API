import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { STATE } from "../models/reservation.enums.js";

const OrdernSchema = new Schema({
  
    User:{ type: Schema.Types.ObjectId, ref: 'User' },
    appartment:{ type: Schema.Types.ObjectId, ref: 'Appartment'},
    
    description: { type: String, required: true},
   
    totalPrice: {
        type: Number,
        required: false
    },

    checkIn: { type: Date,required: true },
    checkOut: { type: Date, required: true},
   
    servicesFee: {
        type: Number,
        required: true
    },
    nightsFee: {
        type: Number,
        required: true
    },
    isPaied:{
        type:Boolean,
        default:false,
    },
  
  
    services: [{ type: Schema.Types.Array, ref: 'Service', required: false, }],
  
    state: {
        type: String,
        enum: [STATE.PENDING, STATE.ACCEPTED,STATE.DECLINED],
        default: STATE.PENDING,
      },
    
},
{ timestamps: true }
);

//ReservationSchema.index({createdAt: 1},{expireAfterSeconds:2592000});

export default model("Order", OrdernSchema);