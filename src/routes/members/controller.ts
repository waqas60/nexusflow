import type { Request, Response } from "express";
import { ResponseHelper } from "../../helper/index.js";
import Organization from "../../models/Organization.js";
import { MemberZod } from "../../schemas/index.js";

export async function addMember(req: Request, res: Response) {
  const result = MemberZod.MemberZodSchema.safeParse({
    ...req.body,
    userId: req.userId,
    orgId: req.params.orgId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  try {
    const existingOrg = await Organization.findOne({
      _id: result.data.orgId,
      userId: result.data.userId,
    });
    if (!existingOrg)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "Either organization donot exists or you are not owner of this organization",
      );

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
    return ResponseHelper.sendSuccessResponse(
      res,
      { newMember },
      "add member created successfully",
    );
  } catch (error) {
    console.error("Error while adding memeber to organization:", error);

    return ResponseHelper.sendErrorResponse(res);
  }
}
export async function deleteMember(req: Request, res: Response) {
  const result = MemberZod.MemberZodSchema.safeParse({
    ...req.body,
    orgId: req.params.orgId,
    userId: req.userId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { memberId, orgId, userId } = result.data;

  try {
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    if (!orgExist)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "Either organization donot exists or you are not owner of this organization",
      );

    const deleteMember = await Organization.findByIdAndDelete(
      { _id: orgId },
      { $pull: { members: memberId } },
    );
    return ResponseHelper.sendSuccessResponse(
      res,
      { data: deleteMember },
      "delete member created successfully",
    );
  } catch (error) {
    console.error("Error while deleting memeber to organization:", error);

    return ResponseHelper.sendErrorResponse(res);
  }
}
export async function fetchAllMember(req: Request, res: Response) {
  const result = MemberZod.GetMemberZodSchema.safeParse({
    orgId: req.params.orgId,
    userId: req.userId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { orgId } = result.data;

  try {
    const members = await Organization.findById({ _id: orgId }).populate(
      "members",
    );
    return ResponseHelper.sendSuccessResponse(
      res,
      { members },
      "fetch members successfully",
    );
  } catch (error) {
    console.log("error while deleting: ", error);

    return ResponseHelper.sendErrorResponse(res);
  }
}
