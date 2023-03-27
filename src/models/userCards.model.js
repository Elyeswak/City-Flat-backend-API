import mongoose from "mongoose";
const { Schema, model } = mongoose;

const creditCardSchema = new mongoose.Schema({
  
    number: {
      type: String,
      required: true,
      unique: true
    },
    exp_month: {
      type: String,
      required: true
    },
    exp_year: {
      type: String,
      required: true
    },
    cvc: {
      type: String,
      required: true
    },
   
},
{ timestamps: true }
  );



  export default model("UserCard", creditCardSchema);