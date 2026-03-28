import type { Request, Response } from "express";
import { OrganizationZodSchema } from "../../schemas/organization.type.js";
import {
  sendAlreadyExistResponse,
  sendErrorResponse,
  sendSuccessResponse,
  sendZodErrorResponse,
} from "../../helper/responseHelper.js";
import Organization from "../../models/Organization.js";

export async function createOrganization(req: Request, res: Response) {
  const result = OrganizationZodSchema.safeParse({
    ...req.body,
    userId: req.userId,
  });
  if (!result.success) return sendZodErrorResponse(res, result.error);
  const { title, description, userId, members } = result.data;

  try {
    const existingOrgs = await Organization.findOne({
      userId: result.data.userId,
      title: result.data.title,
    });
    if (existingOrgs)
      return sendAlreadyExistResponse(
        res,
        "Organization",
        "title",
        result.data.title,
      );

    const newOrg = await Organization.create({
      title,
      description,
      userId,
      members,
    });

    return sendSuccessResponse(
      res,
      { newOrg },
      "Organization created successfully",
    );
  } catch (error) {
    console.error("Error creating organization:", error);
    return sendErrorResponse(res);
  }
}
export async function fetchAllOrganization(req: Request, res: Response) {
  try {
    const data = await Organization.findOne({ userId: req.userId! });
    return sendSuccessResponse(res, { data }, "fetch data successfully");
  } catch (error) {
    console.error("Error creating organization:", error);
    return sendErrorResponse(res);
  }
}
// export async function updateOrganization(req: Request, res: Response) {}
