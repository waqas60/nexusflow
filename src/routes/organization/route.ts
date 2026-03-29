import { Router } from "express";
import { authMiddleware } from "../../middlwares/authMiddleware.js";
import { OrganizationController } from "./organizationController/index.js";
import { OrgMemberController } from "./orgMemberController/index.js";
const router: Router = Router();

router.use(authMiddleware);

router.get("/", OrganizationController.fetchAllOrganization);
router.post("/", OrganizationController.createOrganization);

// member logic
router.get("/:orgId/members", OrgMemberController.fetchAllMember);
router.post("/:orgId/add-member", OrgMemberController.addMember);
router.delete("/:orgId/delete-member", OrgMemberController.deleteMember);

export default router;
