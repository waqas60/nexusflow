import z from "zod";
import { OrganizationZod } from "./index.js";

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

export const CardSchema = OrganizationZod.OrganizationZodSchema.omit({
  members: true,
}).extend({
  assignedTo: OrganizationZod.objectIdSchema,
  status: z.enum(Status),
  difficulty: z.enum(Difficulty),
  orgId: OrganizationZod.objectIdSchema,
  boardId: OrganizationZod.objectIdSchema,
});

export type CardType = z.infer<typeof CardSchema>;
