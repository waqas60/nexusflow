import mongoose from "mongoose";
import { MONGO_URI } from "./constants/constants.js";

export default async function connectToDB() {
  try {
    await mongoose.connect(MONGO_URI!);
    console.log("Database Connection Successfully");
  } catch (error) {
    console.log("Database Connection Failed", error);
    process.exit(1);
  }
}
