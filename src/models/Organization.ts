import mongoose, { model, Schema } from "mongoose";

const organizationSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    members: [{ type: mongoose.Types.ObjectId, ref: "users", default: [] }],
  },
  { timestamps: true },
);

const Organization = model("organization", organizationSchema);
export default Organization;
