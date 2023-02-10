import mongoose from "mongoose";
const { Schema, model } = mongoose;

const NotificationSchema = new Schema(
 {

    User:{ type: Schema.Types.ObjectId, ref: 'User' },
    code:{
        type:String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true
    },

    description: { type: String, required: true},


 }   


)

export default model("Notification", NotificationSchema);