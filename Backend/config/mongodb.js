import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);

    isConnected = db.connections[0].readyState === 1;
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error:", error);
    throw error;
  }
};

export default connectDB;