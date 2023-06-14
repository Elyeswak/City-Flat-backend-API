import express from 'express';
import cors from 'cors';
import { notFoundError, errorHandler } from './middlewares/error_handler.js';
import { handleSockets } from './utils/database/socket.handler.js';
import Passport from './middlewares/passport.js';
import passport from "passport";
import session from 'express-session';
import cookieParser from 'cookie-parser';

import bodyParser from 'body-parser';

import morgan from 'morgan';
/* Imports from project modules */

import { userRouter } from './routes/user.routes.js';
import { appartmentRouter } from './routes/appartment.routes.js';
import { paypalRouter} from './routes/paypal.routes.js';
import { HelpRouter } from './routes/help.routes.js';
import { searchRouter} from './routes/search.routes.js';
import startNotificationCleanup from "./utils/notificationCleanup.js";
import bookedDatesCleanup from "./utils/bookedDatesCleanup.js";

import dotenv from 'dotenv';

/* Accessing .env content */
dotenv.config();

/* Creating express app */
const app = express();





app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/img', express.static('public/images'));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: new Date(Date.now() + 3600000)
    }
 
   
  }));

  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
Passport();



/* Handling different sockets */
handleSockets();

//cron Jobs
startNotificationCleanup();
bookedDatesCleanup();

app.use(passport.initialize());
app.use(passport.session());


/* Using routers */
app.use('/user', userRouter);

app.use('/appartments',appartmentRouter);


app.use('/paypal',paypalRouter);
app.use('/help',HelpRouter);
app.use('/searchApart',searchRouter);

/** Error handlers */
app.use(notFoundError);
app.use(errorHandler);


export default app;