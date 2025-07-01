import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import connectDb from './Config/connectDb.js';
import userRoutes from './Routes/user.route.js'
import courseRoutes from './Routes/course.route.js'
import mediaRoute from './Routes/media.route.js'
import paymentRoute from './Routes/payment.route.js'
import courseProgressRoute from './Routes/courseProgress.route.js'
import cors from 'cors'
import Razorpay from 'razorpay'
const app = express();

dotenv.config()

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin:FRONTEND_URL, 
    credentials: true, 
}))

// connect frontend to backend
const cors = require("cors"); 

// allow frontend from vercel
app.use(cors({
  origin: "https://library-vvb7.vercel.app",  // allow frontend origin
  credentials: true
}));


// Connect to razorpay
export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });


// routes 
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/course',courseRoutes)
app.use('/api/v1/media', mediaRoute);
app.use('/api/v1/payment', paymentRoute);
app.use('/api/v1/progress', courseProgressRoute);  


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})