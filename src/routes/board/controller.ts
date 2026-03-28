import type { Request, Response } from "express";
import BoardSchema from "../../schemas/board.type.js";
import {
  sendAlreadyExistResponse,
  sendOrgNotFoundResponse,
  sendSuccessResponse,
  sendZodErrorResponse,
  sendErrorResponse,
} from "../../helper/responseHelper.js";
import Board from "../../models/Board.js";
import Organization from "../../models/Organization.js";

export async function createBoard(req: Request, res: Response) {
  const result = BoardSchema.safeParse({ ...req.body, userId: req.userId });
  if (!result.success) return sendZodErrorResponse(res, result.error);
  const { title, description, userId, orgId, members } = result.data;
  try {
    // check org exists
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    if (!orgExist) return sendOrgNotFoundResponse(res);

    // check board exists
    const boardExist = await Board.findOne({ orgId, title });
    console.log(boardExist);
    if (boardExist)
      return sendAlreadyExistResponse(res, "Board", "title", title);

    // create board
    const newBoard = await Board.create({
      title,
      description,
      userId,
      orgId,
      members,
    });
    return sendSuccessResponse(res, newBoard, "Board created successfully");
  } catch (error) {
    console.error("Error creating board:", error);
    return sendErrorResponse(res);
  }
}
export async function getAllBoards(req: Request, res: Response) {}
export async function getBoard(req: Request, res: Response) {}
export async function updateBoard(req: Request, res: Response) {}
export async function deleteBoard(req: Request, res: Response) {}
