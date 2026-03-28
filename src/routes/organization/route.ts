import { Router } from "express";
import { createOrganization, fetchOrganization } from "./controller.js";
import { authMiddleware } from "../../middlwares/authMiddleware.js";
const router: Router = Router();

router.post("/", authMiddleware, createOrganization);
router.get("/", authMiddleware, fetchOrganization);

export default router;
