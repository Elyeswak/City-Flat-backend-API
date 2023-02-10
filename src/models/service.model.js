import mongoose from "mongoose";
const { Schema, model } = mongoose;

const serviceSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description: { type: String, required: true},

    pricePerNight: {
        type: Number,
        required: true
    },
    img:
    {
        type: String,
        required: false,
    },

})







export default model("Service", serviceSchema);