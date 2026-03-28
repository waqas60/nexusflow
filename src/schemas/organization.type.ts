import mongoose from "mongoose";
import z from "zod";

export const organizationZodSchema = z.object({
  title: z
    .string()
    .min(3, "Title atleast 3 characters")
    .max(30, "Too long, make it less then 30")
    .trim()
    .toLowerCase(),
  description: z
    .string()
    .min(3, "Description atleast 3 characters")
    .max(100, "Too long, make it less then 100")
    .trim(),
  userId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid Id format")
    .transform((val) => new mongoose.Types.ObjectId(val)),
  members: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid Id format"))
    .default([]),
});


export type OrganizationType = z.infer<typeof organizationZodSchema>;
