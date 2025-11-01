import OrderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

// global variables
const currency = "inr";
const DeliveryCharges = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// placing an order COD method
const placeOrderCOD = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;
    const userId = req.userId;

    console.log("Received data:", { items, totalAmount, address, userId });
    console.log("Request headers:", req.headers);

    if (!userId) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items in cart" });
    }

    const orderData = {
      userId,
      items,
      amount: totalAmount,
      address: address,
      paymentMethod: "COD",
      payment: false,
    };

    console.log("Creating order with data:", orderData);

    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log("Error details:", error);
    res.json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};

// placing an order STRIPE method

const placeOrderStripe = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    if (!userId) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items in cart" });
    }

    const orderData = {
      userId,
      items,
      amount: totalAmount,
      address: address,
      paymentMethod: "STRIPE",
      payment: false,
    };

    console.log("Creating order with data:", orderData);

    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => {
      //   console.log('Processing item for Stripe:', item);
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: `${item.name} (Size: ${item.size})`,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    // console.log('Final line_items for Stripe:', line_items);

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: DeliveryCharges * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Error details:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// verify stripe payment
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (success === "true") {
      await OrderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      await OrderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// placing an order RAZOR PAY - method

const placeOrderRazorPay = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;
    const userId = req.userId;

    const orderData = {
      userId,
      items,
      amount: totalAmount,
      address: address,
      paymentMethod: "Razorpay",
      payment: false,
    };

    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    const options = {
      amount: totalAmount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All orders data for admin panel

const allOrdersData = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error details:", error);
    res.json({
      success: false,
      message: "Error fetching all orders",
      error: error.message,
    });
  }
};

// All orders data for frontend user

const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await OrderModel.find({ userId }).sort({ _id: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error details:", error);
    res.json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

// update order status from admin panel

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await OrderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.log("Error details:", error);
    res.json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// verify razorpay payment
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const userId = req.userId;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

    if (orderInfo.status === 'paid') {
      await OrderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment successful" });
    }else{
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log('Razorpay verification error:', error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrderCOD,
  placeOrderStripe,
  placeOrderRazorPay,
  allOrdersData,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
};
