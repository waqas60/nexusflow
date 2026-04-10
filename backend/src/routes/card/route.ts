import { Router } from "express";
import { CardController } from "./index.js";
import authMiddleware from "../../middlwares/authMiddleware.js";
const router: Router = Router();

router.use(authMiddleware);

router.post("/:orgId/:boardId", CardController.createCard);
router.get("/:orgId/:boardId", CardController.fetchAllCards);
router.delete("/:orgId/:boardId/:cardId", CardController.deleteCard);

router.post("/:orgId/:boardId/:cardId/members", CardController.assignedTo);

router.patch(
  "/:orgId/board/:boardId/task/:cardId/take",
  authMiddleware,
  CardController.takeTask,
);
router.patch(
  "/:orgId/board/:boardId/task/:cardId/status",
  authMiddleware,
  CardController.updateTaskStatus,
);

export default router;
