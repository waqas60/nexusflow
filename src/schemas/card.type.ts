import z from "zod";
import { BoardZod, OrganizationZod } from "./index.js";

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum Status {
  NOT_TAKEN = "not_taken",
  PENDING = "pending",
  DONE = "done",
}

export const CardCreateSchema = OrganizationZod.OrganizationZodSchema.omit({
  members: true,
  userId: true,
}).extend({
  assignedTo: OrganizationZod.objectIdSchema.optional(),
  status: z.enum(Status),
  difficulty: z.enum(Difficulty),
});

export const CardParamsSchema = BoardZod.GetBoardSchema;
export const CardUpdateParamsSchema = CardParamsSchema.extend({
  cardId: OrganizationZod.objectIdSchema,
});
export const CardUpdateSchema = CardCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" },
);

export type CardCreateType = z.infer<typeof CardCreateSchema>;
export type CardParamsType = z.infer<typeof CardParamsSchema>;

export type CardType = CardCreateType & CardParamsType;
