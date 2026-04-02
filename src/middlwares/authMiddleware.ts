import type { NextFunction, Request, Response } from "express";
import { JWT, ResponseHelper } from "../helper/index.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers["authorization"];
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
