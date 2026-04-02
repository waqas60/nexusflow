import Organization from "@/models/Organization.js";
import User from "@/models/User.js";
import { ResponseHelper } from "@/helper/index.js";
import type { Response } from "express";
import type { Types } from "mongoose";

export async function validateOrgOwnership(
  res: Response,
  orgId: Types.ObjectId,
  userId: Types.ObjectId,
) {
  const org = await Organization.findOne({ _id: orgId, userId });
  if (!org) {
    ResponseHelper.sendNotFoundResponse(
      res,
      "Either organization does not exist or you are not the owner",
    );
    return null;
  }
  return org;
}

export async function validateUser(res: Response, email: string) {
  const user = await User.findOne({ email });
  if (!user) {
    ResponseHelper.sendNotFoundResponse(res, "User not found");
    return null;
  }
  return user;
}

export function isSelfAction(
  res: Response,
  userId: Types.ObjectId,
  orgUserId: Types.ObjectId,
) {
  if (userId.equals(orgUserId)) {
    ResponseHelper.sendBadRequestResponse(
      res,
      "You cannot add or remove yourself as a member",
    );
    return true;
  }
  return false;
}

export function formatOrg(org: any) {
  return {
    id: org._id,
    title: org.title,
    description: org.description,
    createdBy: (org.userId as any)?.username,
    members: (org.members as any[]).map((m) => m.username),
    createdAt: (org as any).createdAt?.toLocaleDateString("en-UK"),
  };
}
