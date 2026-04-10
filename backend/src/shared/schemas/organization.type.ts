import MongooseObjectId from "./mongoObjectType.js";
import { Types } from "mongoose";
import z from "zod";

export const OrganizationBaseSchema = z.object({
  title: z
    .string()
    .min(3, "Title atleast 3 characters")
    .max(30, "Too long, make it less then 30")
    .trim()
    .toLowerCase(),
  description: z
    .string()
    .min(3, "Description atleast 3 characters")
    .max(500, "Too long, make it less then 500")
    .trim(),
  members: z.array(z.instanceof(Types.ObjectId)).default([]),
});

export const OrganizationServerSchema = OrganizationBaseSchema.extend({
  userId: MongooseObjectId,
});

export const AddOrgServerSchema = OrganizationServerSchema.pick({
  userId: true,
}).extend({
  orgId: MongooseObjectId,
  email: z.email().trim().toLowerCase(),
});

export const FetchAllMembersInOrg = AddOrgServerSchema.pick({
  userId: true,
  orgId: true,
});

export type OrganizationBaseType = z.infer<typeof OrganizationBaseSchema>;
export type OrganizationServerType = z.infer<typeof OrganizationServerSchema>;


