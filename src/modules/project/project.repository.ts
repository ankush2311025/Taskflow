import  prisma  from "../../config/prisma.js";

export async function createProject(
  orgId: string,
  name: string,
  description?: string
) {
  return prisma.project.create({
    data: {
      orgId,
      name,
      description,
    },
  });
}

export async function findProjectsByOrganization(orgId: string) {
  return prisma.project.findMany({
    where: {
      orgId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function findProjectById(
  projectId: string,
  orgId: string
) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      orgId,
      deletedAt: null,
    },
  });
}
export async function updateProject(
  projectId: string,
  data: {
    name?: string;
    description?: string;
  }
) {
  return prisma.project.update({
    where: { id: projectId },
    data,
  });
}
export async function deleteProject(projectId: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      deletedAt: new Date(),
    },
  });
}
export async function getProjectTaskStats(projectId: string) {
  const result = await prisma.task.groupBy({
    by: ["status"],
    where: {
      projectId,
      deletedAt: null,
    },
    _count: {
      _all: true,
    },
  });

  return result;
}