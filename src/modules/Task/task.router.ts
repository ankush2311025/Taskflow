import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireOrgRole } from "../../middlewares/authorize.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema, assignTaskSchema, getTasksSchema } from "./task.validator.js";
import { createTaskController, getTasksController, updateTaskController, deleteTaskController,updateTaskStatusController,assignTaskController,unassignTaskController } from "./task.controller.js";

const router = Router();

router.post("/:orgId/projects/:projectId/tasks",authenticate,requireOrgRole("org_admin"),validate(createTaskSchema),createTaskController);
router.get("/organizations/:orgId/projects/:projectId/tasks",authenticate,requireOrgRole("org_admin", "member"),validate(getTasksSchema),getTasksController);
router.patch("/organizations/:orgId/projects/:projectId/tasks/:taskId",authenticate,requireOrgRole("org_admin", "member"),validate(updateTaskSchema),updateTaskController);
router.delete("/organizations/:orgId/projects/:projectId/tasks/:taskId",authenticate,requireOrgRole("org_admin"),deleteTaskController);
router.patch("/organizations/:orgId/projects/:projectId/tasks/:taskId/status",authenticate,requireOrgRole("org_admin", "member"),validate(updateTaskStatusSchema),updateTaskStatusController);
router.post("/organizations/:orgId/projects/:projectId/tasks/:taskId/assign",authenticate,requireOrgRole("org_admin"),validate(assignTaskSchema),assignTaskController);
router.delete("/organizations/:orgId/projects/:projectId/tasks/:taskId/assign/:userId",authenticate,requireOrgRole("org_admin"),unassignTaskController);

export default router;