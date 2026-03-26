import type { Request, Response } from "express";
import User from "../../models/User.js";
import { userZodSchema } from "../../schemas/type.js";
import { generatePasswordHash } from "../../helper/hashPasswword.js";

export async function signUp(req: Request, res: Response) {
  // zod check
  const result = userZodSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({
      success: false,
      message: result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  const { username, email, password } = result.data;
  // check user in db
  try {
    const userExists = await User.findOne({ email })
    if (userExists)
      return res
        .status(409)
        .json({ success: false, message: "email already exists" });
    // hash password
    const hashedPassword = await generatePasswordHash(password);
    // store user in db
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "signup successfully",
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
      },
    });
  } catch (error) {
    console.log("Signup endpoint error: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
export async function signIn(req: Request, res: Response) {}
