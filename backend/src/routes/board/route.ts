import { Router } from "express";
import { BoardController } from "./board/index.js";
import { BoardMemberController } from "./boardMember/index.js";
import authMiddleware from "../../middlwares/authMiddleware.js";
const router: Router = Router();

router.use(authMiddleware);

router.post("/:orgId", BoardController.createBoard);
router.get("/:orgId", BoardController.getAllBoards);
router.put("/:orgId/:boardId", BoardController.updateBoard);
router.delete("/:orgId/:boardId", BoardController.deleteBoard);
router.post("/:orgId/:boardId/members", BoardMemberController.addMemberInBoard);
router.delete(
  "/:orgId/:boardId/members",
  BoardMemberController.deleteMemberInBoard,
);
router.get(
  "/:orgId/:boardId/members",
  BoardMemberController.getAllMembersInBoard,
);
router.get(
  "/:orgId/boards",
  authMiddleware,
  BoardMemberController.getBoardsForMember,
);

export default router;
