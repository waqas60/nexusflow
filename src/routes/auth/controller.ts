import type { Request, Response } from "express";
import User from "../../models/User.js";
import {
  userSignInZodSchema,
  userSignUpZodSchema,
} from "../../schemas/user.type.js";
import { Hash, JWT, ResponseHelper } from "../../helper/index.js";

export async function signUp(req: Request, res: Response) {
  const result = userSignUpZodSchema.safeParse(req.body);
  if (!result.success) return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { username, email, password } = result.data;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return ResponseHelper.sendAlreadyExistResponse(res, "email");

    const hashedPassword = await Hash.generatePasswordHash(password);
    
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return ResponseHelper.sendSuccessResponse(
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
    ResponseHelper.sendErrorResponse(res);
  }
}

export async function signIn(req: Request, res: Response) {
  const result = userSignInZodSchema.safeParse(req.body);
  if (!result.success) return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { email, password } = result.data;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return ResponseHelper.sendNotFoundResponse(res, "user not found");

    const passwordMatch = await Hash.comparePassword(password, user.password);
    if (!passwordMatch) return ResponseHelper.sendInvalidCreditionalsReponse(res, "invalid creditionals");

    const token = JWT.createToken({ id: user._id });

    return ResponseHelper.sendSuccessResponse(res, { token }, "signin successfully");
  } catch (error) {
    console.log("signin error occur: ", error);
    
    return ResponseHelper.sendErrorResponse(res);
  }
}
