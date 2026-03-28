import { Router } from "express";
import { createOrganization, fetchOrganization, addMember} from "./controller.js";
import { authMiddleware } from "../../middlwares/authMiddleware.js";
const router: Router = Router();

router.post("/", authMiddleware, createOrganization);
router.get("/", authMiddleware, fetchOrganization);
router.post("/:orgId/add-member", authMiddleware, addMember);

export default router;
