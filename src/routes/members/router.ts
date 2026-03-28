import { Router } from "express";
import { authMiddleware } from "../../middlwares/authMiddleware.js";
import { addMember, deleteMember, fetchAllMember } from "./controller.js";
const router: Router = Router();

router.get("/:orgId", authMiddleware, fetchAllMember);
router.post("/:orgId/add-member", authMiddleware, addMember);
router.delete("/:orgId/delete-member", authMiddleware, deleteMember);

export default router;
