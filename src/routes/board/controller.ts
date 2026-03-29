import type { Request, Response } from "express";
import { BoardZod } from "../../schemas/index.js";
import { ResponseHelper } from "../../helper/index.js";
import Board from "../../models/Board.js";
import Organization from "../../models/Organization.js";
import { sendErrorResponse } from "../../helper/responseHelper.js";

export async function createBoard(req: Request, res: Response) {
  const result = BoardZod.BoardSchema.safeParse({
    ...req.body,
    userId: req.userId,
  });
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

export async function getAllBoards(req: Request, res: Response) {
  const result = BoardZod.GetAllBoardSchema.safeParse({
    orgId: req.params.orgId,
    userId: req.userId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { orgId, userId } = result.data;

  try {
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    if (!orgExist)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "Either organization donot exists or you are not owner of this organization",
      );

    const allBoards = await Board.find({ orgId });

    return ResponseHelper.sendSuccessResponse(
      res,
      { allBoards },
      "fetch boards successfully",
    );
  } catch (error) {
    console.log("error while fetching all boards");
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function getBoard(req: Request, res: Response) {
  const result = BoardZod.GetBoardSchema.safeParse({
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { userId, orgId, boardId } = result.data;

  try {
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    if (!orgExist)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "Either organization donot exists or you are not owner of this organization",
      );

    const board = await Board.findOne({ _id: boardId, orgId });
    if (!board)
      return ResponseHelper.sendNotFoundResponse(res, "board not found");

    return ResponseHelper.sendSuccessResponse(
      res,
      board,
      "fetch specfic board sucessfully",
    );
  } catch (error) {
    console.log("error while fetching board with id", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function updateBoard(req: Request, res: Response) {
  const result = BoardZod.UpdateBoardSchema.safeParse({
    ...req.body,
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { title, description, userId, orgId, boardId } = result.data;

  try {
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    if (!orgExist)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "Either organization donot exists or you are not owner of this organization",
      );

    const updateBoard = await Board.findOneAndUpdate(
      { _id: boardId, orgId },
      { title, description },
      { returnDocument: "after" },
    );
    if (!updateBoard)
      return ResponseHelper.sendNotFoundResponse(res, "board not found");

    return ResponseHelper.sendSuccessResponse(
      res,
      { updateBoard },
      "update board successfully",
    );
  } catch (error) {
    console.log("update board error found ", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function deleteBoard(req: Request, res: Response) {
  const result = BoardZod.GetBoardSchema.safeParse({
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { userId, orgId, boardId } = result.data;

  try {
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    if (!orgId)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "Either organization donot exists or you are not owner of this organization",
      );

    const deleteBoard = await Board.findOneAndDelete({ _id: boardId, orgId });
    
    if (!deleteBoard)
      return ResponseHelper.sendNotFoundResponse(res, "board not found");

    return ResponseHelper.sendSuccessResponse(
      res,
      { deleteBoard },
      "delete board successfully",
    );
  } catch (error) {
    console.log("Error while deleting a board: ", error);
    return sendErrorResponse(res);
  }
}
