import cors from 'cors'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';

import msgRouter from './routes/msgRoutes'
import chatRouter from './routes/chatRoutes'
import indexRouter from './routes/indexRoutes'
import memberRouter from './routes/memberRoutes'

dotenv.config();

const app: Express = express();

// parsing cokkie values
app.use(cookieParser())
// limit the size of incoming request body and parse i.e convert string json to js object for every incoming request
app.use(express.json({ limit: '20kb' }))
// limiting size of url
app.use(express.urlencoded({ extended: false, limit: '1kb' }));
// // setting up client origin
app.use(cors({ origin: ["http://localhost:5173", `${process.env.CLIENT_URL}`], credentials: true, optionsSuccessStatus: 200 }));



app.use('/', indexRouter)
app.use('/c', chatRouter)
app.use('/msg', msgRouter)
app.use('/mem', memberRouter)



export default app