import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { router } from './routes/routes';
export const app=express();


app.use(cors({origin:process.env.CORS_ORIGIN,credentials:true}));
const limit=rateLimit({
    windowMs:1*60*1000,
    max:150,
    message:"Too many requests from this IP, please try again after a minute",
    standardHeaders:true,
    legacyHeaders:true,
},);
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({extended:true,limit:'10kb'}));
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1",helmet(), limit, router);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
