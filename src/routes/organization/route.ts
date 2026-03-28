import { Router } from "express";
import { createOrganization } from "./controller.js";
import { authMiddleware } from "../../middlwares/authMiddleware.js";
const router: Router = Router();

router.post("/", authMiddleware, createOrganization);

export default router;
