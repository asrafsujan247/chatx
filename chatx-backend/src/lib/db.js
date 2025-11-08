import mongoose from "mongoose";

// connect to MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB Connected: ", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MONGODB: ", error);
    process.exit(1); // 1 means code fails && 0 means code runs successfully
  }
};
