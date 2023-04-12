import mongoose from "mongoose";
const { Schema, model } = mongoose;



const HelpMessageSchema = new Schema({
    message: {
        type: String,
        required: true
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
},
{ timestamps: true }
);


export default model("HelpMessage", HelpMessageSchema);