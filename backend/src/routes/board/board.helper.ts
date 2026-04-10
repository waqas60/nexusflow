import type { Response } from "express";
import type { Types } from "mongoose";
import Organization from "../../models/Organization.js";
import { ResponseHelper } from "../../helper/index.js";
import User from "../../models/User.js";
import Board from "../../models/Board.js";

export async function validateOrgOwnership(
  res: Response,
  orgId: Types.ObjectId,
  userId: Types.ObjectId,
) {
  const org = await Organization.findOne({ _id: orgId, userId });
  if (!org) {
    ResponseHelper.sendNotFoundResponse(
      res,
      "Either organization does not exist or you are not the owner",
    );
    return null;
  }
  return org;
}

export async function validateUser(res: Response, email: string) {
  const user = await User.findOne({ email });
  if (!user) {
    ResponseHelper.sendNotFoundResponse(res, "User not found");
    return null;
  }
  return user;
}

export async function validateBoard(
  res: Response,
  boardId: Types.ObjectId,
  orgId: Types.ObjectId,
) {
  const board = await Board.findOne({ _id: boardId, orgId });
  if (!board) {
    ResponseHelper.sendNotFoundResponse(res, "Board not found");
    return null;
  }
  return board;
}

export function isSelfAction(
  res: Response,
  userId: Types.ObjectId,
  orgUserId: Types.ObjectId,
) {
  if (userId.equals(orgUserId)) {
    ResponseHelper.sendBadRequestResponse(
      res,
      "You cannot add or remove yourself as a member",
    );
    return true;
  }
  return false;
}

export function formatBoard(board: any) {
  return {
    id: board._id,
    title: board.title,
    description: board.description,
    createdBy: (board.userId as any)?.username,
    createdAt: (board as any).createdAt?.toLocaleDateString("en-US"),
  };
}

export function formatBoardWithMembers(board: any) {
  return {
    ...formatBoard(board),
    members: (board.members as any[]).map((m) => ({
      id: m._id,
      username: m.username,
    })),
    updatedAt: (board as any).updatedAt?.toLocaleDateString("en-US"),
  };
}
