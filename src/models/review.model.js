import mongoose from "mongoose";
const { Schema, model } = mongoose;




const reviewSchema = new Schema({
    User: { type: Schema.Types.ObjectId, ref: 'User' },
    UserName:String,
    Rating: Number,
    Description:String,
    createdDate: { type: Date, default: Date.now },
})




export default model("Review", reviewSchema);
