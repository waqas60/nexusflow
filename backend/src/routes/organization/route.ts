import { Router } from "express";
import { OrganizationController } from "./org/index.js";
import { OrgMemberController } from "./orgMemberController/index.js";
import authMiddleware from "../../middlwares/authMiddleware.js";
const router: Router = Router();

router.use(authMiddleware);

router.get("/", OrganizationController.fetchAllOrganization);
router.post("/", OrganizationController.createOrganization);
router.delete("/:orgId", OrganizationController.deleteOrganization);

// member routes
router.get("/:orgId/members", OrgMemberController.fetchAllMembers);
router.post("/:orgId/members", OrgMemberController.addMember);
router.delete("/:orgId/members", OrgMemberController.deleteMember);

export default router;
