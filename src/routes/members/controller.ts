import type { Request, Response } from "express";
import {
  sendErrorResponse,
  sendNotFoundResponse,
  sendSuccessResponse,
  sendZodErrorResponse,
} from "../../helper/responseHelper.js";
import Organization from "../../models/Organization.js";
import {
  GetMemberZodSchema,
  MemberZodSchema,
} from "../../schemas/member.type.js";

export async function addMember(req: Request, res: Response) {
  const result = MemberZodSchema.safeParse({
    ...req.body,
    userId: req.userId,
    orgId: req.params.orgId,
  });
  if (!result.success) return sendZodErrorResponse(res, result.error);

  try {
    // check org exist with userid
    const existingOrg = await Organization.findOne({
      _id: result.data.orgId,
      userId: result.data.userId,
    });
    if (!existingOrg)
      return sendNotFoundResponse(
        res,
        "Either organization donot exists or you are not owner of this organization",
      );
    // check member already exists
    const newMember = await Organization.findOneAndUpdate(
      {
        _id: result.data.orgId,
        userId: { $ne: result.data.memberId },
      },
      {
        $addToSet: { members: result.data.memberId },
      },
      { returnDocument: "after" },
    )
      .populate("members")
      .populate("userId");
    return sendSuccessResponse(
      res,
      { newMember },
      "add member created successfully",
    );
  } catch (error) {
    console.error("Error while adding memeber to organization:", error);
    return sendErrorResponse(res);
  }
}
export async function deleteMember(req: Request, res: Response) {
  const result = MemberZodSchema.safeParse({
    ...req.body,
    orgId: req.params.orgId,
    userId: req.userId,
  });
  if (!result.success) return sendZodErrorResponse(res, result.error);

  const { memberId, orgId, userId } = result.data;
  try {
    // check orgId and userId in DB
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    if (!orgExist)
      return sendNotFoundResponse(
        res,
        "Either organization donot exists or you are not owner of this organization",
      );

    // delete member
    const deleteMember = await Organization.findByIdAndUpdate(
      { _id: orgId },
      { $pull: { members: memberId } },
    );
    return sendSuccessResponse(
      res,
      { data: deleteMember },
      "delete member created successfully",
    );
  } catch (error) {
    console.error("Error while deleting memeber to organization:", error);
    return sendErrorResponse(res);
  }
}
export async function fetchAllMember(req: Request, res: Response) {
  const result = GetMemberZodSchema.safeParse({
    orgId: req.params.orgId,
    userId: req.userId,
  });
  if (!result.success) return sendZodErrorResponse(res, result.error);
  const { orgId } = result.data;
  try {
    const members = await Organization.findById({ _id: orgId }).populate(
      "members",
    );
    return sendSuccessResponse(
      res,
      { data: members },
      "fetch members successfully",
    );
  } catch (error) {
    console.log("error while deleting: ", error);
    return sendErrorResponse(res);
  }
}
