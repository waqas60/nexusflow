import type { Request, Response } from "express";
import { BoardZod } from "../../schemas/index.js";
import { ResponseHelper } from "../../helper/index.js";
import Board from "../../models/Board.js";
import Organization from "../../models/Organization.js";

export async function createBoard(req: Request, res: Response) {
  const result = BoardZod.BoardSchema.safeParse({ ...req.body, userId: req.userId });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { title, description, userId, orgId, members } = result.data;

  try {
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    if (!orgExist)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "Either organization donot exists or you are not owner of this organization",
      );

    const boardExist = await Board.findOne({ orgId, title });
    if (boardExist)
      return ResponseHelper.sendAlreadyExistResponse(
        res,
        "Board",
        "title",
        title,
      );

    const newBoard = await Board.create({
      title,
      description,
      userId,
      orgId,
      members,
    });
    return ResponseHelper.sendSuccessResponse(
      res,
      newBoard,
      "Board created successfully",
    );
  } catch (error) {
    console.error("Error creating board:", error);

    return ResponseHelper.sendErrorResponse(res);
  }
}
export async function getAllBoards(req: Request, res: Response) {}
export async function getBoard(req: Request, res: Response) {}
export async function updateBoard(req: Request, res: Response) {}
export async function deleteBoard(req: Request, res: Response) {}
