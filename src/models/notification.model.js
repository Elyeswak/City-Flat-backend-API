import mongoose from "mongoose";
const { Schema, model } = mongoose;
const NotificationSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      read: {
        type: Boolean,
        default: false,
      },
      readAt: {
        type: Date,
      }
    },
    { timestamps: true }
  );

export default model("Notification", NotificationSchema);