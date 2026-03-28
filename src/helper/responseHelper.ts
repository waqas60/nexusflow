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
export const sendZodError = (res: Response, error: ZodError) => {
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
}


type SendResponseType = {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data?: any;
};
