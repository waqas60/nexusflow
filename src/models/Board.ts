import mongoose, { model, Schema } from "mongoose";

const boardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    orgId: {
      type: mongoose.Types.ObjectId,
      ref: "organizations",
      required: true,
    },
    members: [
      { type: mongoose.Types.ObjectId, ref: "organizations", default: [] },
    ],
  },
  { timestamps: true },
);

const Board = model("boards", boardSchema);
export default Board;
