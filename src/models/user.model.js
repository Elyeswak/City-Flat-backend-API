import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { ROLE } from "../models/user.enums.js";


const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
   
    password: { type: String, required: true},
    email: {type: String, required:true,unique: true},
    number:{type: String, required:false,unique: true},
    address:{
        type: String,
        required: false
    },

    isVerified: { type: Boolean, default: false },
    verifCode: String,
    verificationCode: {
        type: String,
      },
  
    BirthDate: { type: Date, },
    role: {
        type: String,
        enum: [ROLE.ADMIN, ROLE.USER],
        default: ROLE.USER,
      },
  
    img:
    {
        type: String,
        required: false,
    },

    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation', required: false }],
    notifications: [{ type: Schema.Types.Array, ref: 'Notification', required: false }],
    
    
},
{ timestamps: true }
);



export default model("User", UserSchema);
