
import mongoose, { model, Schema } from "mongoose";
import type { BoardType } from "../shared/schemas/board.type.js";

const boardSchema = new Schema<BoardType>(
  {
    title: { type: String, required: true},
    description: { type: String, required: true },
    members: [{ type: mongoose.Types.ObjectId, ref: "users", default: [] }],
    orgId: {
      type: mongoose.Types.ObjectId,
      ref: "organizations",
      required: true,
    },
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true },
);

const Board = model("boards", boardSchema);

export default Board;
