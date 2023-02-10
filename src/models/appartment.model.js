import mongoose from "mongoose";
const { Schema, model } = mongoose;



const AppartmentSchema = new Schema({
    name:{
        type: String,
        required: true
    },
   
    description: { type: String, required: true},
   
    pricePerNight: {
        type: Number,
        required: true
    },

    
    FromDate: { type: Date, },
    ToDate: { type: Date, },
    location:{
        type:String,
        required: 'Location is required'
    },
   
    rooms: {
        type: Number,
        required: true
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', required: false }],
    services: [{ type: Schema.Types.ObjectId, ref: 'Service', required: false }],
    img:
    {
        type: String,
        required: false,
    },
    
    
},
{ timestamps: true }
);



export default model("Appartment", AppartmentSchema);
