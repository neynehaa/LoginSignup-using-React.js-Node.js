import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Attempting to connect to the database...");
    console.log(`MongoDB URI: ${process.env.MONGO_URI}`);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Could not connect to database", error);
  }
};

export default connectDB;
