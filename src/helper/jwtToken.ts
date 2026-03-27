import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/constants.js";

export function createToken(payload: Record<string, any>) {
  return jwt.sign(payload, JWT_SECRET!);
}
