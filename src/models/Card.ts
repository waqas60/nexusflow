import mongoose, { model, Schema } from "mongoose";
import { Difficulty, Status, type CardType } from "../schemas/card.type.js";
const ObjectId = mongoose.Types.ObjectId;

const cardSchema = new Schema<CardType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: ObjectId, default: null, ref: "users" },
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
    boardId: { type: ObjectId, required: true, ref: "boards" },
    orgId: { type: ObjectId, required: true, ref: "organizations" },
    userId: { type: ObjectId, required: true, ref: "users" },
  },
  { timestamps: true },
);

const Card = model("cards", cardSchema);
export default Card;
