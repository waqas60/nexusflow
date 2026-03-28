import mongoose, { model, Schema } from "mongoose";
import type { BoardType } from "../schemas/board.type.js";

const boardSchema = new Schema<BoardType>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
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
