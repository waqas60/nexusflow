import type { Request, Response } from "express";
import User from "../../models/User.js";
import {
  userSignInZodSchema,
  userSignUpZodSchema,
} from "../../schemas/user.type.js";
import {
  comparePassword,
  generatePasswordHash,
} from "../../helper/hashPasswword.js";
import { createToken } from "../../helper/jwtToken.js";
import {
  sendAlreadyExistResponse,
  sendErrorResponse,
  sendInvalidCreditionalsReponse,
  sendNotFoundResponse,
  sendSuccessResponse,
  sendZodErrorResponse,
} from "../../helper/responseHelper.js";

export async function signUp(req: Request, res: Response) {
  // zod check
  const result = userSignUpZodSchema.safeParse(req.body);
  if (!result.success) return sendZodErrorResponse(res, result.error);

  const { username, email, password } = result.data;
  // check user in db
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return sendAlreadyExistResponse(res, "email");
    // hash password
    const hashedPassword = await generatePasswordHash(password);
    // store user in db
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return sendSuccessResponse(
      res,
      {
        username: user.username,
        email: user.email,
        id: user._id,
      },
      "signup successfully",
    );
  } catch (error) {
    console.log("Signup endpoint error: ", error);
    sendErrorResponse(res);
  }
}

export async function signIn(req: Request, res: Response) {
  const result = userSignInZodSchema.safeParse(req.body);
  if (!result.success) return sendZodErrorResponse(res, result.error);
  const { email, password } = result.data;
  try {
    // check user in db
    const user = await User.findOne({ email }).select("+password");
    if (!user) return sendNotFoundResponse(res, "user not found");

    // check password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch)
      return sendInvalidCreditionalsReponse(res)

    // create jwt token
    const token = createToken({ id: user._id });
    return sendSuccessResponse(res, { token }, "signin successfully");
  } catch (error) {
    console.log("signin error occur: ", error);
    return sendErrorResponse(res)
  }
}
