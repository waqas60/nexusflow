import { type Response } from "express";

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

type SendResponseType = {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data?: any;
};
