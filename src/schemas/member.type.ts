import { objectIdSchema, OrganizationZodSchema } from "./organization.type.js";

export const MemberZodSchema = OrganizationZodSchema.pick({
  userId: true,
}).extend({
  memberId: objectIdSchema,
  orgId: objectIdSchema,
});

export const GetMemberZodSchema = MemberZodSchema.omit({ memberId: true });
