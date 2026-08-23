import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireOrgRole } from "../../middlewares/authorize.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createProjectSchema , updateProjectSchema} from "./project.validator.js";
import { createProjectController , getProjectsController, getProjectController, updateProjectController, deleteProjectController, getProjectDashboardController} from "./project.controller.js";

const router = Router();

router.post("/:orgId/projects",authenticate,requireOrgRole("org_admin"),validate(createProjectSchema),createProjectController);
router.get("/:orgId/projects",authenticate,requireOrgRole("org_admin", "member"),getProjectsController);
router.get("/:orgId/projects/:projectId",authenticate,requireOrgRole("org_admin", "member"),getProjectController);
router.patch("/:orgId/projects/:projectId",authenticate,requireOrgRole("org_admin"),validate(updateProjectSchema),updateProjectController);
router.delete("/:orgId/projects/:projectId",authenticate,requireOrgRole("org_admin"),deleteProjectController);
router.get("/:orgId/projects/:projectId/dashboard",authenticate,requireOrgRole("org_admin", "member"),getProjectDashboardController);

export default router;