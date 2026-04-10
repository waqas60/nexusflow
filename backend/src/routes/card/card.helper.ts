import Board from "@/models/Board.js";
import Card from "@/models/Card.js";
import { ResponseHelper } from "@/helper/index.js";
import type { Response } from "express";
import type { Types } from "mongoose";

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

export async function validateCard(
  res: Response,
  cardId: Types.ObjectId,
  boardId: Types.ObjectId,
  orgId: Types.ObjectId,
) {
  const card = await Card.findOne({ _id: cardId, boardId, orgId });
  if (!card) {
    ResponseHelper.sendNotFoundResponse(res, "Card not found");
    return null;
  }
  return card;
}

export function formatCard(card: any) {
  return {
    id: card._id,
    title: card.title,
    description: card.description,
    status: card.status,
    difficulty: card.difficulty,
    assignedTo: card.assignedTo?.username,
    boardId: card.boardId,
    orgId: card.orgId,
    createdAt: (card as any).createdAt?.toLocaleDateString("en-US"),
    updatedAt: (card as any).updatedAt?.toLocaleDateString("en-US"),
  };
}
