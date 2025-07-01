import express from 'express';
import { createCheckoutSession, getKey, paymentVerification } from '../Controller/coursePurchased.controller.js';
import { isAuthenticated } from '../Middleware/isAuthenticated.js';

const router = express.Router();


router.post('/checkout',isAuthenticated,createCheckoutSession )
router.post('/paymentVerification/:CourseId',isAuthenticated,paymentVerification)
router.get('/getKey',isAuthenticated,getKey )
export default router