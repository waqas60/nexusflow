import mongoose from "mongoose";
import z from "zod";

const MongooseObjectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid Id format")
  .transform((val) => new mongoose.Types.ObjectId(val));


export default MongooseObjectId
