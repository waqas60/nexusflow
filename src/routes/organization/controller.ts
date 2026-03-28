import type { Request, Response } from "express";
import { organizationZodSchema } from "../../schemas/organization.type.js";
import sendResponse from "../../helper/sendResponse.js";
import Organization from "../../models/Organization.js";

export async function createOrganization(req: Request, res: Response) {
  const result = organizationZodSchema.safeParse({
    ...req.body,
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
  const { title, description, userId, members } = result.data;

  try {
    const existingOrgs = await Organization.findOne({
      userId: result.data.userId,
      title: result.data.title,
    });
    if (existingOrgs)
      return sendResponse({
        res,
        statusCode: 409,
        success: false,
        message: `Organization with title ${result.data.title} already exists`,
      });

    const newOrg = await Organization.create({
      title,
      description,
      userId,
      members,
    });

    return sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "Organization created successfully",
      data: newOrg,
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
}
export async function fetchOrganization(req: Request, res: Response) {
  try {
    const data = await Organization.findOne({ userId: req.userId! });
    console.log(data);
    return sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "fetch data successfully",
      data,
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
}
