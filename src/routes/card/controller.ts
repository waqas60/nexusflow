import { ResponseHelper } from "@/helper/index.js";
import Card from "@/models/Card.js";
import { CardZod } from "@shared/schemas/index.js";
import type { Request, Response } from "express";
import { formatCard, validateBoard, validateCard } from "./card.helper.js";
import { validateOrgOwnership } from "../organization/org.helper.js";

export async function createCard(req: Request, res: Response) {
  const result = CardZod.CardServerSchema.safeParse({
    ...req.body,
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { boardId, orgId, userId, title, description, difficulty, status } =
    result.data;

  try {
    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    const board = await validateBoard(res, boardId, orgId);
    if (!board) return;

    const cardExist = await Card.findOne({ boardId, title });
    if (cardExist)
      return ResponseHelper.sendAlreadyExistResponse(res, "Card", title);

    const newCard = await Card.create({
      title,
      description,
      status,
      difficulty,
      boardId,
      orgId,
      userId,
    });

    return ResponseHelper.sendSuccessResponse(
      res,
      formatCard(newCard.toObject()),
      "Card created successfully",
    );
  } catch (error) {
    console.error("Error while creating card:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function fetchAllCards(req: Request, res: Response) {
  const result = CardZod.CardAllGetSchema.safeParse({
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

    const cards = await Card.find({ boardId, orgId }).lean();

    if (!cards.length)
      return ResponseHelper.sendNotFoundResponse(res, "No cards found");

    return ResponseHelper.sendSuccessResponse(
      res,
      cards.map(formatCard),
      "Cards fetched successfully",
    );
  } catch (error) {
    console.error("Error while fetching cards:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function updateCard(req: Request, res: Response) {
  const result = CardZod.CardUpdateSchema.safeParse({
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
    cardId: req.params.cardId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const body = CardZod.CardUpdateSchema.safeParse(req.body);
  if (!body.success)
    return ResponseHelper.sendZodErrorResponse(res, body.error);

  const { userId, orgId, boardId, cardId } = result.data;

  try {
    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    const board = await validateBoard(res, boardId, orgId);
    if (!board) return;

    const updatedCard = await Card.findOneAndUpdate(
      { _id: cardId, boardId, orgId },
      { $set: body.data },
      { returnDocument: "after" },
    ).lean();

    if (!updatedCard)
      return ResponseHelper.sendNotFoundResponse(res, "Card not found");

    return ResponseHelper.sendSuccessResponse(
      res,
      formatCard(updatedCard),
      "Card updated successfully",
    );
  } catch (error) {
    console.error("Error while updating card:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function deleteCard(req: Request, res: Response) {
  const result = CardZod.CardUpdateSchema.safeParse({
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
    cardId: req.params.cardId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { userId, orgId, boardId, cardId } = result.data;

  try {
    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;

    const board = await validateBoard(res, boardId, orgId);
    if (!board) return;

    const card = await validateCard(res, cardId, boardId, orgId);
    if (!card) return;

    await card.deleteOne();

    return ResponseHelper.sendSuccessResponse(
      res,
      {
        title: card.title,
        deletedAt: new Date().toLocaleDateString("en-US"),
      },
      "Card deleted successfully",
    );
  } catch (error) {
    console.error("Error while deleting card:", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}