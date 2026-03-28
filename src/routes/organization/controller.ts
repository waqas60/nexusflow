import type { Request, Response } from "express";
import { OrganizationZodSchema } from "../../schemas/organization.type.js";
import { ResponseHelper } from "../../helper/index.js";
import Organization from "../../models/Organization.js";

export async function createOrganization(req: Request, res: Response) {
  const result = OrganizationZodSchema.safeParse({
    ...req.body,
    userId: req.userId,
  });
  if (!result.success) return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { title, description, userId, members } = result.data;

  try {
    const existingOrgs = await Organization.findOne({
      userId: result.data.userId,
      title: result.data.title,
    });
    if (existingOrgs)
      return ResponseHelper.sendAlreadyExistResponse(
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

    return ResponseHelper.sendSuccessResponse(
      res,
      { newOrg },
      "Organization created successfully",
    );
  } catch (error) {
    console.error("Error creating organization:", error);

    return ResponseHelper.sendErrorResponse(res);
  }
}
export async function fetchAllOrganization(req: Request, res: Response) {
  try {
    const data = await Organization.findOne({ userId: req.userId! });

    return ResponseHelper.sendSuccessResponse(res, { data }, "fetch data successfully");
  } catch (error) {
    console.error("Error creating organization:", error);
    
    return ResponseHelper.sendErrorResponse(res);
  }
}
// export async function updateOrganization(req: Request, res: Response) {}
