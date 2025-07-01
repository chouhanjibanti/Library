import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongo_url = process.env.MONGO_URI;

// Connect to MongoDB
const connectDb = mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => {
    console.error(err);
    console.log("Db connection error");
    process.exit(1);
  });

  export default connectDb