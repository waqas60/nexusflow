import { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getAllBoards,
  getBoard,
  updateBoard,
} from "./controller.js";
import { authMiddleware } from "../../middlwares/authMiddleware.js";
const router: Router = Router();

router.post("/", authMiddleware, createBoard);
router.get("/:orgId", authMiddleware, getAllBoards);
router.get("/:orgId/:boardId", authMiddleware, getBoard);
router.put("/:orgId/:boardId", authMiddleware, updateBoard);
router.delete("/:orgId/:boardId", authMiddleware, deleteBoard);

export default router;
