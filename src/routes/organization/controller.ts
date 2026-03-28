import type { Request, Response } from "express";
import { organizationZodSchema } from "../../schemas/organization.type.js";
import sendResponse from "../../helper/sendResponse.js";
import { success } from "zod";

export async function createOrganization(req: Request, res: Response) {
  const result = organizationZodSchema.safeParse(req.body);
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

    const {title, description, } = result.data
}
