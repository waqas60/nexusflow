import { ResponseHelper } from "@/helper/index.js";
import Organization from "@/models/Organization.js";
import { OrganizationZod } from "@shared/schemas/index.js";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { formatOrg } from "../org.helper.js";

export async function createOrganization(req: Request, res: Response) {
  const result = OrganizationZod.OrganizationServerSchema.safeParse({
    ...req.body,
    userId: req.userId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { title, description, userId } = result.data;

  try {
    const existingOrg = await Organization.findOne({ userId, title });
    if (existingOrg)
      return ResponseHelper.sendAlreadyExistResponse(
        res,
        "Organization",
        title,
      );

    const newOrg = await Organization.create({ title, description, userId });

    return ResponseHelper.sendSuccessResponse(
      res,
      {
        title: newOrg.title,
        description: newOrg.description,
        createdAt: (newOrg as any).createdAt.toLocaleDateString("en-UK", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      },
      "Organization created successfully",
    );
  } catch (error) {
    console.error("Error creating organization:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function fetchAllOrganization(req: Request, res: Response) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const orgs = await Organization.find({
      $or: [{ userId }, { members: userId }],
    })
      .select("title description createdAt members userId")
      .populate("userId", "username -_id")
      .populate("members", "username -_id")
      .lean();

    if (!orgs.length)
      return ResponseHelper.sendNotFoundResponse(res, "No organizations found");

    return ResponseHelper.sendSuccessResponse(
      res,
      orgs.map(formatOrg),
      "Organizations fetched successfully",
    );
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function updateOrganization(req: Request, res: Response) {
  const result = OrganizationZod.OrganizationServerSchema.safeParse({
    ...req.body,
    userId: req.userId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { title, description, userId } = result.data;
  const orgId = req.params.orgId;

  try {
    const updatedOrg = await Organization.findOneAndUpdate(
      { _id: orgId, userId },
      { title, description },
      { returnDocument: "after" },
    )
      .populate("userId", "username -_id")
      .populate("members", "username -_id")
      .lean();

    if (!updatedOrg)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "Organization not found or you are not the owner",
      );

    return ResponseHelper.sendSuccessResponse(
      res,
      formatOrg(updatedOrg),
      "Organization updated successfully",
    );
  } catch (error) {
    if ((error as any).code === 11000)
      return ResponseHelper.sendAlreadyExistResponse(
        res,
        "Organization",
        title,
      );
    console.error("Error updating organization:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}
