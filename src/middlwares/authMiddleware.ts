import type { NextFunction, Request, Response } from "express";
import { JWT, ResponseHelper } from "../helper/index.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ResponseHelper.sendInvalidCreditionalsReponse(
      res,
      "Unauthorized: Missing or malformed token",
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return ResponseHelper.sendInvalidCreditionalsReponse(
      res,
      "Unauthorized: Missing or malformed token",
    );
  }
  try {
    const decoded = JWT.verifyToken(token) as Record<string, any>;
    req.userId = decoded.id;

    next();
  } catch (error) {
    return ResponseHelper.sendInvalidCreditionalsReponse(res, "invalid token");
  }
}
