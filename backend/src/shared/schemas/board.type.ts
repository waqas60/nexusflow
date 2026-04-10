import z from "zod";
import { OrganizationZod } from "./index.js";
import MongooseObjectId from "./mongoObjectType.js";

export const BoardBaseSchema = OrganizationZod.OrganizationBaseSchema.extend({
  orgId: MongooseObjectId,
  userId: MongooseObjectId,
});

export const GetAllBoardSchema = BoardBaseSchema.pick({
  orgId: true,
  userId: true,
});

export const GetBoardSchema = GetAllBoardSchema.extend({
  boardId: MongooseObjectId,
});

export const UpdateBoardSchema = BoardBaseSchema.partial({
  title: true,
  description: true,
})
  .extend({
    boardId: MongooseObjectId,
  })
  .refine((data) => data.title || data.description, {
    message: "either title or description field must be provided",
  });
export const BoardMemberSchema = GetBoardSchema.extend({
  email: z.email().trim().toLowerCase(),
});

export type BoardType = z.infer<typeof BoardBaseSchema>;
