import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireOrgRole } from "../../middlewares/authorize.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {createCommentSchema,updateCommentSchema,} from "./comment.validator.js";
import {createCommentController,getCommentsController,updateCommentController,deleteCommentController,} from "./comment.controller.js";

const router = Router();

router.post("/:orgId/projects/:projectId/tasks/:taskId/comments",authenticate,requireOrgRole("org_admin", "member"),validate(createCommentSchema),createCommentController);
router.get("/:orgId/projects/:projectId/tasks/:taskId/comments",authenticate,requireOrgRole("org_admin", "member"),getCommentsController);
router.patch("/:orgId/projects/:projectId/tasks/:taskId/comments/:commentId",authenticate,requireOrgRole("org_admin", "member"),validate(updateCommentSchema),updateCommentController);
router.delete("/:orgId/projects/:projectId/tasks/:taskId/comments/:commentId",authenticate,requireOrgRole("org_admin", "member"),deleteCommentController);

export default router;