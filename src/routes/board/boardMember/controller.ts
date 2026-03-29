import type { Request, Response } from "express";
import { BoardZod } from "../../../schemas/index.js";
import { ResponseHelper } from "../../../helper/index.js";
import Board from "../../../models/Board.js";

export async function addMemberInBoard(req: Request, res: Response) {
  const result = BoardZod.BoardMemberSchema.safeParse({
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
    memberId: req.body.memberId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { userId, orgId, boardId, memberId } = result.data;

  if (userId === memberId)
    return ResponseHelper.sendBadRequestResponse(
      res,
      "You cannot add or remove yourself as a member",
    );

  try {
    const boardFound = await Board.findOneAndUpdate(
      { _id: boardId, orgId, userId },
      { $addToSet: { members: memberId } },
      { returnDocument: "after" },
    );

    if (!boardFound)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "board not found or you are not allowed to access",
      );

    return ResponseHelper.sendSuccessResponse(
      res,
      { boardFound },
      "add member in board successfully",
    );
  } catch (error) {
    console.log("Error while add member in board: ", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}
export async function deleteMemberInBoard(req: Request, res: Response) {
  const result = BoardZod.BoardMemberSchema.safeParse({
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
    memberId: req.params.memberId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { userId, orgId, boardId, memberId } = result.data;

  if (userId === memberId)
    return ResponseHelper.sendBadRequestResponse(
      res,
      "You cannot add or remove yourself as a member",
    );

  try {
    const deleteBoard = await Board.findOneAndUpdate(
      { _id: boardId, orgId, userId },
      { $pull: { members: memberId } },
      { returnDocument: "after" },
    );

    if (!deleteBoard)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "board not found or you are not allowed to access",
      );

    if (deleteBoard.members.length === 0)
      return ResponseHelper.sendNotFoundResponse(res, "no member found");

    return ResponseHelper.sendSuccessResponse(
      res,
      { deleteBoard },
      "delete member in board successfully",
    );
  } catch (error) {
    console.log("Error while add member in board: ", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}
