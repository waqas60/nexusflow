import type { Request, Response } from "express";
import {
  isSelfAction,
  validateBoard,
  validateOrgOwnership,
  validateUser,
} from "../board.helper.js";
import { BoardZod } from "../../../shared/schemas/index.js";
import { ResponseHelper } from "../../../helper/index.js";
import Board from "../../../models/Board.js";

export async function addMemberInBoard(req: Request, res: Response) {
  const result = BoardZod.BoardMemberSchema.safeParse({
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
    email: req.body.email,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { userId, orgId, boardId, email } = result.data;

  try {
    const user = await validateUser(res, email);
    if (!user) return;

    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    const memberCheck = isSelfAction(res, user._id, org.userId);
    if (memberCheck) {
      console.log(memberCheck);
      return;
    }

    const board = await validateBoard(res, boardId, orgId);
    if (!board) return;

    if (board.members.includes(user._id))
      return ResponseHelper.sendAlreadyExistResponse(res, "User");

    const updatedBoard = await Board.findOneAndUpdate(
      { _id: boardId, orgId },
      { $addToSet: { members: user._id } },
      { returnDocument: "after" },
    );

    return ResponseHelper.sendSuccessResponse(
      res,
      { updatedBoard },
      "Member added successfully",
    );
  } catch (error) {
    console.log("Error while adding member in board: ", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function deleteMemberInBoard(req: Request, res: Response) {
  const result = BoardZod.BoardMemberSchema.safeParse({
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
    email: req.body.email,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { userId, orgId, boardId, email } = result.data;

  try {
    const user = await validateUser(res, email);
    if (!user) return;

    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    if (isSelfAction(res, user._id, org.userId)) return;

    const board = await validateBoard(res, boardId, orgId);
    if (!board) return;

    if (!board.members.includes(user._id))
      return ResponseHelper.sendNotFoundResponse(
        res,
        "User is not a member of this board",
      );

    await Board.findOneAndUpdate(
      { _id: boardId, orgId },
      { $pull: { members: user._id } },
    );

    return ResponseHelper.sendSuccessResponse(
      res,
      {
        username: user.username,
        deletedAt: new Date().toLocaleDateString("en-US"),
      },
      "Member removed successfully",
    );
  } catch (error) {
    console.log("Error while removing member from board: ", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function getAllMembersInBoard(req: Request, res: Response) {
  const result = BoardZod.GetBoardSchema.safeParse({
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { userId, orgId, boardId } = result.data;

  try {
    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    const board = await Board.findOne({ _id: boardId, orgId })
      .populate("members", "username _id")
      .lean();

    if (!board)
      return ResponseHelper.sendNotFoundResponse(res, "Board not found");

    if (board.members.length === 0)
      return ResponseHelper.sendNotFoundResponse(res, "No members found");

    const formattedData = {
      boardId: board._id,
      title: board.title,
      description: board.description,
      members: (board.members as any).map((m: { _id: any; username: any }) => ({
        id: m._id,
        username: m.username,
      })),
      orgId: board.orgId,
      createdAt: (board as any).createdAt.toLocaleDateString("en-US"),
    };

    return ResponseHelper.sendSuccessResponse(
      res,
      formattedData,
      "Members fetched successfully",
    );
  } catch (error) {
    console.log("Error while fetching members: ", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function getBoardsForMember(req: Request, res: Response) {
  const result = BoardZod.GetAllBoardSchema.safeParse({
    orgId: req.params.orgId,
    userId: req.userId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { userId, orgId } = result.data;

  try {
    const boards = await Board.find({
      orgId,
      members: userId,
    }).lean();

    if (!boards.length)
      return ResponseHelper.sendNotFoundResponse(res, "No boards found");

    console.log(boards);

    return ResponseHelper.sendSuccessResponse(
      res,
      { boards },
      "Boards fetched successfully",
    );
  } catch (error) {
    console.log("Error while fetching boards for member: ", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}
