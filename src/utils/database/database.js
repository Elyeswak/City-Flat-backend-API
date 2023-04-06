import mongoose from "mongoose";
import dotenv from "dotenv";

/* Accessing .env content */
dotenv.config();

/* Defining database url & name */
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

/* Global promise to be used accross the api */
mongoose.Promise = global.Promise;

/* Connecting to database */
async function connectDatabase() {
  await mongoose
    .connect(`${DB_URL}${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: {
        w: "majority",
      },
    })
    .then(() => {
      console.log(`Connected [${DB_NAME}]`);
    })
    .catch((err) => {
      console.log(err);
    });
}

/* Disconnecting database */
async function disconnectDatabase() {
  await mongoose
    .disconnect(`${DB_URL}${DB_NAME}`)
    .then(() => {
      console.log(`Disconnected [${DB_NAME}]`);
    })
    .catch((err) => {
      console.log(err);
    });
}

export { connectDatabase, disconnectDatabase };
