import { Router } from "express";
import { CardController } from "./index.js";
import { authMiddleware } from "@/middlwares/authMiddleware.js";
const router: Router = Router();

router.use(authMiddleware);

router.post("/:orgId/:boardId", CardController.createCard);
// router.get("/:orgId/:boardId", CardController.fetchAllCards);
// router.put("/:orgId/:boardId/:cardId", CardController.updateCard);
// router.delete("/:orgId/:boardId/:cardId", CardController.deleteCard);

export default router;
