import type { Request, Response } from "express";
import {
  formatBoard,
  formatBoardWithMembers,
  validateBoard,
  validateOrgOwnership,
} from "../board.helper.js";
import { BoardZod } from "../../../shared/schemas/index.js";
import { ResponseHelper } from "../../../helper/index.js";
import Board from "../../../models/Board.js";
import Organization from "../../../models/Organization.js";

export async function createBoard(req: Request, res: Response) {
  const result = BoardZod.BoardBaseSchema.safeParse({
    ...req.body,
    userId: req.userId,
    orgId: req.params.orgId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  console.log(result);

  const { title, description, userId, orgId } = result.data;

  try {
    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    const boardExist = await Board.findOne({ orgId, title, userId });
    if (boardExist) {
      console.log(boardExist);
      return ResponseHelper.sendAlreadyExistResponse(res, "Board", title);
    }
    const newBoard = await Board.create({ title, description, userId, orgId });
    await newBoard.populate("userId", "username -_id");

    return ResponseHelper.sendSuccessResponse(
      res,
      formatBoard(newBoard.toObject()),
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
    const org = await Organization.findOne({ _id: orgId });
    if (!org) return ResponseHelper.sendNotFoundResponse(res, "Org not found");

    const isAdmin = org.userId.toString() === userId.toString();
    const isOrgMember = org.members.includes(userId);

    let query = {};

    if (isAdmin || isOrgMember) {
      query = { orgId };
    } else {
      query = { orgId, members: userId };
    }

    const allBoards = await Board.find(query)
      .populate("userId", "-_id username")
      .populate("members", "-_id username")
      .populate("orgId", "_id title")
      .lean();

    const formattedData = allBoards.map((board) => ({
      id: board._id,
      orgId: (board.orgId as any)._id,
      orgTitle: (board.orgId as any).title,
      title: board.title,
      description: board.description,
      members: board.members,
      createdBy: (board.userId as any)?.username ?? "Unknown",
      createdAt: (board as any).createdAt.toLocaleDateString("en-US"),
    }));

    return ResponseHelper.sendSuccessResponse(
      res,
      formattedData,
      "Boards fetched successfully",
    );
  } catch (error) {
    console.log("Error while fetching all boards:", error);
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
    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    const updatedBoard = await Board.findOneAndUpdate(
      { _id: boardId, orgId },
      { title, description },
      { returnDocument: "after" },
    )
      .populate("userId", "-_id username")
      .populate("members", "-_id username")
      .lean();

    if (!updatedBoard)
      return ResponseHelper.sendNotFoundResponse(res, "Board not found");

    return ResponseHelper.sendSuccessResponse(
      res,
      formatBoardWithMembers(updatedBoard),
      "Board updated successfully",
    );
  } catch (error) {
    if ((error as any).code === 11000)
      return ResponseHelper.sendAlreadyExistResponse(res, "Board", title);
    console.log("Error while updating board:", error);
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
    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    const board = await validateBoard(res, boardId, orgId);
    if (!board) return;

    await board.deleteOne();

    return ResponseHelper.sendSuccessResponse(
      res,
      {
        title: board.title,
        deletedAt: new Date().toLocaleDateString("en-US"),
      },
      "Board deleted successfully",
    );
  } catch (error) {
    console.log("Error while deleting a board:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}
