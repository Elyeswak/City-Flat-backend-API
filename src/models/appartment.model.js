import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { APPARTTYPE } from "../models/appartment.enums.js";


const AppartmentSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
        validate: {
          validator: (name) => /^[a-zA-Z\s]{6,}$/.test(name),
          message: 'Name should only contain letters and spaces, and be at least 6 characters long',
        },
      },
      description: {
        type: String,
        required: true,
        validate: {
          validator: (description) => description.length >= 10,
          message: 'Description should be at least 10 characters long',
        },
      },
      pricePerNight: {
        type: Number,
        required: true,
        validate: {
          validator: (price) => /^\d+$/.test(price),
          message: 'Price should only contain digits',
        },
      },
      bookedDates: [{ start: Date, end: Date }],
      location: {
        type: String,
        required: 'Location is required',
      },
      type: {
        type: String,
        enum: [APPARTTYPE.STANDARD, APPARTTYPE.PREMIUM, APPARTTYPE.LUXURY],
        default: APPARTTYPE.STANDARD,
      },
      rooms: {
        type: Number,
        required: true,
        validate: {
          validator: (rooms) => /^\d+$/.test(rooms),
          message: 'Rooms should only contain digits',
        },
      },
      reviews: [{ type: Schema.Types.Array, ref: 'Review', required: false }],
      services: [{ type: Schema.Types.Array, ref: 'Service', required: false }],
      img: {
        type: String,
        required: false,
      },
    },
    { timestamps: true }
  );


export default model("Appartment", AppartmentSchema);
