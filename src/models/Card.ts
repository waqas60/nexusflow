import mongoose, { model, Schema } from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const cardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: ObjectId, default: null, ref: "users" },
    status: {
      type: String,
      enum: ["not_taken", "pending", "done"],
      default: "not_taken",
    },
    board: { type: ObjectId, required: true, ref: "boards" },
    orgId: { type: ObjectId, required: true, ref: "organizations" },
    userId: { type: ObjectId, required: true, ref: "users" },
  },
  { timestamps: true },
);

const Card = model("cards", cardSchema);
export default Card;
