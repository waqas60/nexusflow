import type { NextFunction, Request, Response } from "express";
import sendResponse from "../helper/sendResponse.js";
import { verifyToken } from "../helper/jwtToken.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      message: "Unauthorized: Missing or malformed token",
    });

  const token = authHeader.split(" ")[1];
  if (!token)
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      message: "Unauthorized: Missing or malformed token",
    });

  try {
    const decoded = verifyToken(token) as Record<string, any>;
    req.userId = decoded.id;
    next();
  } catch (error) {
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      message: "Invalid Token",
    });
  }
}
