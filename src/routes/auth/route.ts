import { Router } from "express";
import { signIn, signUp } from "./controller.js";
const router:Router = Router()

router.get("/signup", signUp)
router.post("/signin", signIn)

export default router