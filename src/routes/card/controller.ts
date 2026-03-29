import type { Request, Response } from "express";
import { CardZod } from "../../schemas/index.js";
import { ResponseHelper } from "../../helper/index.js";
import Organization from "../../models/Organization.js";
import Board from "../../models/Board.js";
import Card from "../../models/Card.js";

export async function createCard(req: Request, res: Response) {
  const resultParams = CardZod.CardParamsSchema.safeParse({
    userId: req.userId,
    orgId: req.params.orgId,
    boardId: req.params.boardId,
  });
  if (!resultParams.success)
    return ResponseHelper.sendZodErrorResponse(res, resultParams.error);

  const result = CardZod.CardCreateSchema.safeParse(req.body);
  
  if (!result.success)
    return ResponseHelper.sendZodErrorResponse(res, result.error);

  const { boardId, orgId, userId } = resultParams.data;

  try {
    const orgExist = await Organization.findOne({ _id: orgId, userId });
    if (!orgExist)
      return ResponseHelper.sendNotFoundResponse(
        res,
        "either org not found or you are not allowed to access this org",
      );

    const boardExist = await Board.findOne({ _id: boardId, orgId, userId });
    if (!boardExist)
      return ResponseHelper.sendNotFoundResponse(res, "board not found");

    const cardExist = await Card.findOne({ orgId, title: result.data.title });
    if (cardExist)
      return ResponseHelper.sendAlreadyExistResponse(
        res,
        "Card",
        "title",
        result.data.title,
      );

    const newCard = await Card.create({
      title: result.data.title,
      description: result.data.description,
      status: result.data.status,
      difficulty: result.data.difficulty,
      boardId,
      orgId,
      userId,
    });

    return ResponseHelper.sendSuccessResponse(
      res,
      newCard,
      "card created successfully",
    );
  } catch (error) {
    console.log("Error while creating card ", error);
    return ResponseHelper.sendErrorResponse(res);
  }
}

export async function fetchAllCards(req: Request, res: Response) {}

export async function updateCard(req: Request, res: Response) {}

export async function deleteCard(req: Request, res: Response) {}
