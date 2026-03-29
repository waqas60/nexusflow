import { Router } from "express";
import { CardController } from "./index.js";
import { authMiddleware } from "../../middlwares/authMiddleware.js";
const router: Router = Router();

router.use(authMiddleware)

router.post("/:orgId/:boardId", CardController.createCard);
router.get("/", CardController.fetchAllCards);
router.put("/", CardController.updateCard);
router.delete("/", CardController.deleteCard);

export default router;
