import type z from "zod";
import { OrganizationZod } from "./index.js";

export const BoardSchema = OrganizationZod.OrganizationZodSchema.extend({
  orgId: OrganizationZod.objectIdSchema,
});

export const GetAllBoardSchema = BoardSchema.pick({
  orgId: true,
  userId: true,
});

export const GetBoardSchema = GetAllBoardSchema.extend({
  boardId: OrganizationZod.objectIdSchema,
});

export const UpdateBoardSchema = BoardSchema.partial({
  title: true,
  description: true,
})
  .extend({
    boardId: OrganizationZod.objectIdSchema,
  })
  .refine((data) => data.title || data.description, {
    message: "either title or description field must be provided",
  });

export type BoardType = z.infer<typeof BoardSchema>;
