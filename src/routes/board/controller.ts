import type { Request, Response } from "express";
import BoardSchema from "../../schemas/board.type.js";
import sendResponse, { sendZodError } from "../../helper/responseHelper.js";
import Board from "../../models/Board.js";
import Organization from "../../models/Organization.js";

export async function createBoard(req: Request, res: Response) {
  const result = BoardSchema.safeParse({ ...req.body, userId: req.userId });
  console.log(result);
  if (!result.success) return sendZodError(res, result.error);
  const { title, description, userId, orgId, members } = result.data;
  try {
    // check org exists
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    console.log(orgExist);
    if (!orgExist)
      return sendResponse({
        res,
        statusCode: 404,
        success: false,
        message:
          "Either organization donot exists or you are not owner of this organization",
      });

    // check board exists
    const boardExist = await Board.findOne({ orgId, title });
    console.log(boardExist);
    if (boardExist)
      return sendResponse({
        res,
        statusCode: 409,
        success: false,
        message: `Board with title ${title} already exists`,
      });

    // create board
    const newBoard = await Board.create({
      title,
      description,
      userId,
      orgId,
      members,
    });
    console.log("b", newBoard);
    return sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "Board created successfully",
      data: newBoard,
    });
  } catch (error) {
    console.error("Error creating board:", error);
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
}
export async function getAllBoards(req: Request, res: Response) {}
export async function getBoard(req: Request, res: Response) {}
export async function updateBoard(req: Request, res: Response) {}
export async function deleteBoard(req: Request, res: Response) {}
