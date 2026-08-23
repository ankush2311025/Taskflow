import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createTask , getTasks, updateTask,deleteTask,updateTaskStatus, unassignTaskService, assignTaskService} from "./task.service.js";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await createTask(
      req.params.orgId as string,
      req.params.projectId as string,
      req.body
    );

    res.status(201).json({
      success: true,
      data: task,
    });
  }
);
export const getTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const tasks = await getTasks(
      req.params.orgId as string,
      req.params.projectId as string,
      req.query as any
    );

    res.status(200).json({
      success: true,
      ...tasks,
    });
  }
);
export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await updateTask(
      req.params.orgId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.body
    );

    res.status(200).json({
      success: true,
      data: task,
    });
  }
);
export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteTask(
      req.params.orgId as string,
      req.params.projectId as string,
      req.params.taskId as string
    );

    res.status(204).send();
  }
);
export const updateTaskStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await updateTaskStatus(
      req.userId,
      req.params.orgId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.body.status
    );

    res.status(200).json({
      success: true,
      data: task,
    });
  }
);

export const assignTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const assignment = await assignTaskService(
      req.params.orgId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.body.userId
    );

    res.status(201).json({
      success: true,
      data: assignment,
    });
  }
);

export const unassignTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    await unassignTaskService(
      req.params.orgId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.params.userId as string
    );

    res.status(204).send();
  }
);