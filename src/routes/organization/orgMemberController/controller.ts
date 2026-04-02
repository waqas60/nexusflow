import { ResponseHelper } from "@/helper/index.js";
import Organization from "@/models/Organization.js";
import { OrganizationZod } from "@shared/schemas/index.js";
import type { Request, Response } from "express";
import {
  isSelfAction,
  validateOrgOwnership,
  validateUser,
} from "../org.helper.js";

export async function addMember(req: Request, res: Response) {
  const result = OrganizationZod.AddOrgServerSchema.safeParse({
    ...req.body,
    userId: req.userId,
    orgId: req.params.orgId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { email, userId, orgId } = result.data;

  try {
    const user = await validateUser(res, email);
    if (!user) return;

    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    if (isSelfAction(res, user._id, org.userId)) return;

    if (org.members.some((m) => m.equals(user._id)))
      return ResponseHelper.sendAlreadyExistResponse(res, "User", email);

    org.members.push(user._id);
    await org.save();

    await org.populate("members", "username -_id");
    const members = (org.toObject().members as any[]).map((m) => m.username);

    return ResponseHelper.sendSuccessResponse(
      res,
      { members },
      "Member added successfully",
    );
  } catch (error) {
    console.error("Error while adding member to organization:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function deleteMember(req: Request, res: Response) {
  const result = OrganizationZod.AddOrgServerSchema.safeParse({
    ...req.body,
    orgId: req.params.orgId,
    userId: req.userId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { orgId, userId, email } = result.data;

  try {
    const user = await validateUser(res, email);
    if (!user) return;

    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    if (isSelfAction(res, user._id, org.userId)) return;

    if (!org.members.some((m) => m.equals(user._id)))
      return ResponseHelper.sendNotFoundResponse(
        res,
        "User is not a member of this organization",
      );

    org.members = org.members.filter((m) => !m.equals(user._id));
    await org.save();

    return ResponseHelper.sendSuccessResponse(
      res,
      {
        username: user.username,
        removedAt: new Date().toLocaleDateString("en-US"),
      },
      "Member removed successfully",
    );
  } catch (error) {
    console.error("Error while removing member from organization:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function fetchAllMembers(req: Request, res: Response) {
  const result = OrganizationZod.FetchAllMembersInOrg.safeParse({
    orgId: req.params.orgId,
    userId: req.userId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { orgId, userId } = result.data;

  try {
    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    await org.populate("members", "-_id username email");

    if (org.members.length === 0)
      return ResponseHelper.sendNotFoundResponse(res, "No members found");

    const members = (org.members as any[]).map((m) => ({
      username: m.username,
      email: m.email,
    }));

    return ResponseHelper.sendSuccessResponse(
      res,
      { members },
      "Members fetched successfully",
    );
  } catch (error) {
    console.error("Error while fetching members:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}
