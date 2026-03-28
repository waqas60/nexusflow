import { Router } from "express";
import {
  createOrganization,
  fetchAllOrganization,
} from "./controller.js";
import { authMiddleware } from "../../middlwares/authMiddleware.js";
const router: Router = Router();

router.get("/", authMiddleware, fetchAllOrganization);
router.post("/", authMiddleware, createOrganization);

export default router;
