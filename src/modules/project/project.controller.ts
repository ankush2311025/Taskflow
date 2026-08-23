import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createProject, getProjects, getProject , updateProject, deleteProject, getProjectDashboard} from "./project.service.js";

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await createProject(
      req.params.orgId as string,
      req.body.name,
      req.body.description
    );

    res.status(201).json({
      success: true,
      data: project,
    });
  }
);
export const getProjectsController = asyncHandler(
  async (req: Request, res: Response) => {
    const projects = await getProjects(
      req.params.orgId as string
    );

    res.status(200).json({
      success: true,
      data: projects,
    });
  }
);
export const getProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await getProject(
      req.params.orgId as string,
      req.params.projectId as string
    );

    res.status(200).json({
      success: true,
      data: project,
    });
  }
);
export const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await updateProject(
      req.params.orgId as string,
      req.params.projectId as string,
      req.body
    );

    res.status(200).json({
      success: true,
      data: project,
    });
  }
);
export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteProject(
      req.params.orgId as string,
      req.params.projectId as string
    );

    res.status(204).send();
  }
);
export const getProjectDashboardController = asyncHandler(
  async (req: Request, res: Response) => {
    const dashboard = await getProjectDashboard(
      req.params.orgId as string,
      req.params.projectId as string
    );

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  }
);