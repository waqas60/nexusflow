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
router.get("/:boardId", authMiddleware, getBoard);
router.put("/:boardId", authMiddleware, updateBoard);
router.delete("/:boardId", authMiddleware, deleteBoard);

export default router;
