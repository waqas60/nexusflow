import {
  Difficulty,
  Status,
  type CardServerSchemaType,
} from "@/shared/schemas/card.type.js";
import mongoose, { model, Schema } from "mongoose";

const cardSchema = new Schema<CardServerSchemaType>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(Status) as Status[],
      default: Status.NOT_TAKEN,
    },
    difficulty: {
      type: String,
      enum: Object.values(Difficulty) as Difficulty[],
      default: Difficulty.MEDIUM,
    },
    assignedTo: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    boardId: { type: mongoose.Types.ObjectId, required: true, ref: "boards" },
    orgId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "organizations",
    },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  },
  { timestamps: true },
);



const Card = model("cards", cardSchema);


export default Card;
