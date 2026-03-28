import type { Request, Response } from "express";
import sendResponse from "../../helper/responseHelper.js";
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
  if (!result.success)
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "incorrect input",
      data: result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });

  try {
    // check org exist with userid
    const existingOrg = await Organization.findOne({
      _id: result.data.orgId,
      userId: result.data.userId,
    });
    if (!existingOrg)
      return sendResponse({
        res,
        statusCode: 404,
        success: false,
        message:
          "Either organization donot exists or you are not owner of this organization",
      });
    // check member already exists
    const memberExist = await Organization.findOneAndUpdate(
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
    // const orgData = memberExist?.toObject();
    // console.log(orgData);
    return sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "add member created successfully",
      data: memberExist,
    });
  } catch (error) {
    console.error("Error while adding memeber to organization:", error);
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
}
export async function deleteMember(req: Request, res: Response) {
  const result = MemberZodSchema.safeParse({
    ...req.body,
    orgId: req.params.orgId,
    userId: req.userId,
  });
  if (!result.success)
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "incorrect input",
      data: result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });

  const { memberId, orgId, userId } = result.data;
  try {
    // check orgId and userId in DB
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    if (!orgExist)
      return sendResponse({
        res,
        statusCode: 404,
        success: false,
        message:
          "Either organization donot exists or you are not owner of this organization",
      });

    // delete member
    const deleteMember = await Organization.findByIdAndUpdate(
      { _id: orgId },
      { $pull: { members: memberId } },
    );
    return sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "add member created successfully",
      data: deleteMember,
    });
  } catch (error) {
    console.error("Error while deleting memeber to organization:", error);
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
}
export async function fetchAllMember(req: Request, res: Response) {
  const result = GetMemberZodSchema.safeParse({
    orgId: req.params.orgId,
    userId: req.userId,
  });
  if (!result.success)
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "incorrect input",
      data: result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });

  const { orgId } = result.data;
  const members = await Organization.findById({ _id: orgId }).populate(
    "members",
  );
  res.json(members);
}
