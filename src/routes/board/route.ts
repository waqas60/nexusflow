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
router.get("/", getAllBoards);
router.get("/:boardId", getBoard);
router.put("/:boardId", updateBoard);
router.delete("/:boardId", deleteBoard);

export default router;
