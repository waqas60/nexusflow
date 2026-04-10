import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants.js";

export function createToken(payload: Record<string, any>) {
  return jwt.sign(payload, JWT_SECRET!);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET!);
}
