import { Router } from "express";
import { authMiddleware } from "../../middlwares/authMiddleware.js";
import { BoardMemberController } from "./boardMember/index.js";
import { BoardController } from "./board/index.js";
const router: Router = Router();

router.use(authMiddleware)

router.post("/", BoardController.createBoard);
router.get("/:orgId", BoardController.getAllBoards);
router.get("/:orgId/:boardId", BoardController.getBoard);
router.put("/:orgId/:boardId", BoardController.updateBoard);
router.delete("/:orgId/:boardId", BoardController.deleteBoard);

// board member
router.post("/:orgId/:boardId/members", BoardMemberController.addMemberInBoard);
router.get("/:orgId/:boardId/:memberId", BoardMemberController.getAllMembersInBoard)
router.delete("/:orgId/:boardId/:memberId", BoardMemberController.deleteMemberInBoard);

export default router;
    