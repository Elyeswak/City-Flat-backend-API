import mongoose from "mongoose";
const { Schema, model } = mongoose;

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
    transactionId:{
        type:String,
       },
  
    services: [{ type: Schema.Types.Array, ref: 'Service', required: false, }],
  
    isConfirmed: { type: Boolean, default: false },
    
},
{ timestamps: true }
);

//ReservationSchema.index({createdAt: 1},{expireAfterSeconds:2592000});

export default model("Order", OrdernSchema);