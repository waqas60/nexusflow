import { type Response } from "express";
import type { ZodError } from "zod";

export default function sendResponse({
  res,
  statusCode,
  success,
  message,
  data,
}: SendResponseType) {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}
export const sendZodErrorResponse = (res: Response, error: ZodError) => {
  return sendResponse({
    res,
    statusCode: 400,
    success: false,
    message: "incorrect input",
    data: error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    })),
  });
};

export const sendOrgNotFoundResponse = (res: Response) => {
  return sendResponse({
    res,
    statusCode: 404,
    success: false,
    message:
      "Either organization donot exists or you are not owner of this organization",
  });
};

export const sendAlreadyExistResponse = (
  res: Response,
  label: string,
  field: string,
  value: string,
) => {
  return sendResponse({
    res,
    statusCode: 409,
    success: false,
    message: `${label} with ${field} ${value} already exists`,
  });
};

export const sendSuccessResponse = (
  res: Response,
  data: Record<string, any>,
  message: string,
) => {
  return sendResponse({
    res,
    statusCode: 201,
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = (res: Response) => {
  return sendResponse({
    res,
    statusCode: 500,
    success: false,
    message: "Internal server error",
  });
};

type SendResponseType = {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data?: any;
};
