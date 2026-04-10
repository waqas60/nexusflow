import z from "zod";
import { BoardZod, OrganizationZod } from "./index.js";
import MongooseObjectId from "./mongoObjectType.js";

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

export const CardBaseSchema = OrganizationZod.OrganizationBaseSchema.omit({
  members: true,
}).extend({
  status: z.enum(Status),
  difficulty: z.enum(Difficulty),
});

export const CardServerSchema = CardBaseSchema.extend({
  userId: MongooseObjectId,
  assignedTo: MongooseObjectId.optional(),
  boardId: MongooseObjectId,
  orgId: MongooseObjectId,
});

export const CardAllGetSchema = BoardZod.GetBoardSchema;

export const CardUpdateSchema = CardAllGetSchema.extend({
  cardId: MongooseObjectId,
});

export const updateStateSchema = CardUpdateSchema.extend({
  status: z.enum(Status),
})

export const AssignedTaskToSchema = z.object({
  userId: MongooseObjectId,
  orgId: MongooseObjectId,
  boardId: MongooseObjectId,
  cardId: MongooseObjectId,
  email: z.email().trim().toLowerCase(),
});

export type CardType = z.infer<typeof CardBaseSchema>;
export type CardServerSchemaType = z.infer<typeof CardServerSchema>;
