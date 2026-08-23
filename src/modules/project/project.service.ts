import { AppError } from "../../utils/AppError.js";
import {createProject as createProjectRepo,
    findProjectsByOrganization, 
    findProjectById, 
    updateProject as updateProjectRepo,
    deleteProject as deleteProjectRepo,
    getProjectTaskStats
} from "./project.repository.js";
import { findOrganizationById } from "../organization/organization.repository.js";

export async function createProject(
  orgId: string,
  name: string,
  description?: string
) {
  const organization = await findOrganizationById(orgId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return createProjectRepo(
    orgId,
    name,
    description
  );
}
export async function getProjects(
  orgId: string
) {
  const organization = await findOrganizationById(orgId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return findProjectsByOrganization(orgId);
}
export async function getProject(
  orgId: string,
  projectId: string
) {
  const project = await findProjectById(
    projectId,
    orgId
  );

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
}
export async function updateProject(
  orgId: string,
  projectId: string,
  data: {
    name?: string;
    description?: string;
  }
) {
  const project = await findProjectById(projectId, orgId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return updateProjectRepo(projectId, data);
}
export async function deleteProject(
  orgId: string,
  projectId: string
) {
  const project = await findProjectById(projectId, orgId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return deleteProjectRepo(projectId);
}
export async function getProjectDashboard(
  orgId: string,
  projectId: string
) {
  const project = await findProjectById(projectId, orgId);

  if (!project) {
    throw new AppError(
      "Project not found in this organization",
      404
    );
  }

  const stats = await getProjectTaskStats(projectId);

  return stats;
}