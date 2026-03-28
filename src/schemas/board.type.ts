import type z from "zod";
import { OrganizationZod } from "./index.js";

export const BoardSchema = OrganizationZod.OrganizationZodSchema.extend({
  orgId: OrganizationZod.objectIdSchema,
});

export type BoardType = z.infer<typeof BoardSchema>;
