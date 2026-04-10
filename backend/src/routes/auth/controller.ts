import type { Request, Response } from "express";
import { UserZod } from "../../shared/schemas/index.js";
import { Hash, JWT, ResponseHelper } from "../../helper/index.js";
import User from "../../models/User.js";

export async function signUp(req: Request, res: Response) {
  const result = UserZod.userSignUpZodSchema.safeParse(req.body);
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { username, email, password } = result.data;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return ResponseHelper.sendAlreadyExistResponse(res, "email");

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
      },
      "signup successfully",
    );
  } catch (error) {
    console.log("Signup endpoint error: ", error);
    ResponseHelper.sendErrorResponse(res);
  }
}

export async function signIn(req: Request, res: Response) {
  const result = UserZod.userSignInZodSchema.safeParse(req.body);
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { email, password } = result.data;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return ResponseHelper.sendNotFoundResponse(res, "user not found");

    const passwordMatch = await Hash.comparePassword(password, user.password);
    if (!passwordMatch)
      return ResponseHelper.sendInvalidCreditionalsReponse(
        res,
        "invalid creditionals",
      );

    const token = JWT.createToken({ id: user._id });

    return ResponseHelper.sendSuccessResponse(
      res,
      { token, username: user.username },
      "signin successfully",
    );
  } catch (error) {
    console.log("signin error occur: ", error);

    return ResponseHelper.sendErrorResponse(res);
  }
}
