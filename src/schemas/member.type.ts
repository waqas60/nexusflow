import { OrganizationZod } from "./index.js";

export const MemberZodSchema = OrganizationZod.OrganizationZodSchema.pick({
  userId: true,
}).extend({
  memberId: OrganizationZod.objectIdSchema,
  orgId: OrganizationZod.objectIdSchema,
});

export const GetMemberZodSchema = MemberZodSchema.omit({ memberId: true });
