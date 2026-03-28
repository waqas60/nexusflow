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
import sendResponse from "../../helper/responseHelper.js";

export async function signUp(req: Request, res: Response) {
  // zod check
  const result = userSignUpZodSchema.safeParse(req.body);
  if (!result.success)
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "incorrect input",
      data: result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  const { username, email, password } = result.data;
  // check user in db
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return sendResponse({
        res,
        statusCode: 409,
        success: false,
        message: "email already exists",
      });
    // hash password
    const hashedPassword = await generatePasswordHash(password);
    // store user in db
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "signup successfully",
      data: {
        username: user.username,
        email: user.email,
        id: user._id,
      },
    });
  } catch (error) {
    console.log("Signup endpoint error: ", error);
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "internal server error",
    });
  }
}
export async function signIn(req: Request, res: Response) {
  const result = userSignInZodSchema.safeParse(req.body);
  if (!result.success)
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "incorrect input",
      data: result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  const { email, password } = result.data;
  try {
    // check user in db
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return sendResponse({
        res,
        statusCode: 404,
        success: false,
        message: "user not found",
      });

    // check password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch)
      return sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: "invalid creditional",
      });

    // create jwt token
    const token = createToken({ id: user._id });
    sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "signin successfully",
      data: token,
    });
  } catch (error) {
    console.log("signin error occur: ", error);
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "internal server error",
    });
  }
}
