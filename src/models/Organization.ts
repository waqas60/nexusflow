import mongoose, { model, Schema } from "mongoose";
import type { OrganizationType } from "../schemas/organization.type.js";


const organizationSchema = new Schema<OrganizationType>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    members: [{ type: mongoose.Types.ObjectId, ref: "users", default: [] }],
  },
  { timestamps: true },
);

const Organization = model("organizations", organizationSchema);
export default Organization;
