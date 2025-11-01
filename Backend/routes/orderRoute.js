
import express from 'express';
import {placeOrderCOD,placeOrderStripe, placeOrderRazorPay, allOrdersData, userOrders, updateStatus, verifyStripe, verifyRazorpay} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/auth.js';

const orderRouter = express.Router();

// admin features
orderRouter.post('/list', adminAuth, allOrdersData);
orderRouter.post('/status', adminAuth, updateStatus);

// payment features
orderRouter.post('/place', userAuth, placeOrderCOD);
orderRouter.post('/stripe', userAuth, placeOrderStripe);
orderRouter.post('/razorpay', userAuth, placeOrderRazorPay);

// user features
orderRouter.post('/userorders', userAuth, userOrders);

// verify payment
orderRouter.post('/verifyStripe', userAuth, verifyStripe);
orderRouter.post('/verifyRazorpay', userAuth, verifyRazorpay);

export default orderRouter;