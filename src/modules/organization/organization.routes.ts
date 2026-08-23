import { Router } from "express";
import { getOrganizationController, createOrganizationController, addMemberController, updateOrganizationController,deleteOrganizationController } from "./organization.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireOrgRole } from "../../middlewares/authorize.middleware.js";
import { addMemberSchema, createOrganizationSchema, updateOrganizationSchema } from "./organization.validator.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router()

router.get('/:orgId', authenticate,requireOrgRole("org_admin", "member"), getOrganizationController)
router.post('/', authenticate, validate(createOrganizationSchema), createOrganizationController)
router.post('/:orgId/members', authenticate, requireOrgRole("org_admin"), validate(addMemberSchema), addMemberController)
router.patch("/:orgId",authenticate,requireOrgRole("org_admin"),validate(updateOrganizationSchema),updateOrganizationController);
router.delete("/:orgId",authenticate,requireOrgRole("org_admin"),deleteOrganizationController);

export default router