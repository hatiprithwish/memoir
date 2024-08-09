import mongoose from "mongoose";
import app from "../server.js";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`Connected to DB 🕺🏼`);
  } catch (error) {
    console.error(`😥 Failed to connect to DB: ${error.message}`);
  }
};

export default connectToDB;
