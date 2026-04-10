import type { Request, Response } from "express";
import { formatCard, validateBoard, validateCard } from "./card.helper.js";
import {
  isSelfAction,
  validateOrgOwnership,
  validateUser,
} from "../organization/org.helper.js";
import { CardZod } from "../../shared/schemas/index.js";
import { ResponseHelper } from "../../helper/index.js";
import Card from "../../models/Card.js";
import Organization from "../../models/Organization.js";

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
    const org = await Organization.findOne({ _id: orgId });
    if (!org) return ResponseHelper.sendNotFoundResponse(res, "no org found");

    const board = await validateBoard(res, boardId, orgId);
    if (!board) return;

    const cards = await Card.find({ boardId, orgId })
      .populate("assignedTo", "username -_id")
      .lean();

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

export async function assignedTo(req: Request, res: Response) {
  const result = CardZod.AssignedTaskToSchema.safeParse({
    email: req.body.email,
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
    cardId: req.params.cardId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { email, userId, orgId, boardId, cardId } = result.data;

  try {
    const user = await validateUser(res, email);
    if (!user) return;

    const org = await validateOrgOwnership(res, orgId, userId);
    if (!org) return;
    if (isSelfAction(res, user._id, org.userId)) return;

    const board = await validateBoard(res, boardId, orgId);
    if (!board) return;
    const existingCard = await Card.findOne({ _id: cardId, boardId });
    if (!existingCard)
      return ResponseHelper.sendNotFoundResponse(res, "Card not found");

    if (existingCard.assignedTo)
      return ResponseHelper.sendAlreadyExistResponse(res, "User", email);

    const card = await Card.findOneAndUpdate(
      { _id: cardId, boardId },
      { assignedTo: user._id, status: "pending" },
      { new: true },
    ).populate("assignedTo", "username -_id");

    return ResponseHelper.sendSuccessResponse(
      res,
      { card },
      "Member added successfully",
    );
  } catch (error) {
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function takeTask(req: Request, res: Response) {
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
    const task = await Card.findOneAndUpdate(
      {
        _id: cardId,
        boardId: boardId,
        status: "not_taken",
      },
      {
        assignedTo: userId,
        status: "pending",
      },
      { new: true },
    );

    if (!task)
      return ResponseHelper.sendNotFoundResponse(res, "Task not available");

    return ResponseHelper.sendSuccessResponse(
      res,
      { task },
      "Task taken successfully",
    );
  } catch (error) {
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function updateTaskStatus(req: Request, res: Response) {
  const result = CardZod.updateStateSchema.safeParse({
    status: req.body.status,
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
    cardId: req.params.cardId,
  });
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { userId, orgId, boardId, cardId, status } = result.data;

  try {
    const task = await Card.findOneAndUpdate(
      {
        _id: cardId,
        boardId: boardId,
        assignedTo: userId,
      },
      { status },
      { new: true },
    );

    if (!task)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "Card not found or not assigned to you",
      );

    return ResponseHelper.sendSuccessResponse(res, { task }, "Status updated");
  } catch (error) {
    return ResponseHelper.sendErrorResponse(res);
  }
}
