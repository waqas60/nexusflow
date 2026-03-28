import type z from "zod";
import { objectIdSchema, OrganizationZodSchema } from "./organization.type.js";

const BoardSchema = OrganizationZodSchema.extend({ orgId: objectIdSchema });

export default BoardSchema;

export type BoardType = z.infer<typeof BoardSchema>;
