import { Router } from "express";
import { createOrganization } from "./controller.js";
const router:Router = Router()

router.post("/", createOrganization)

export default router