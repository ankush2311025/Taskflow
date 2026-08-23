import  prisma  from "../../config/prisma.js";

export async function createTask(
  projectId: string,
  data: {
    title: string;
    description?: string;
    status?: "todo" | "in_progress" | "review" | "done";
    priority?: "low" | "medium" | "high" | "urgent";
    dueDate?: Date;
  }
) {
  return prisma.task.create({
    data: {
      projectId,
      ...data,
    },
  });
}
export async function findTasksByProject(
  projectId: string,
  filters: {
    status?: "todo" | "in_progress" | "review" | "done";
    priority?: "low" | "medium" | "high" | "urgent";
    assignee?: string;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    skip: number;
    take: number;
  }
) {
  const where = {
    projectId,
    deletedAt: null,

    ...(filters.status && {
      status: filters.status,
    }),

    ...(filters.priority && {
      priority: filters.priority,
    }),

    ...(filters.assignee && {
      assignments: {
        some: {
          userId: filters.assignee,
        },
      },
    }),

    ...((filters.dueDateFrom || filters.dueDateTo) && {
      dueDate: {
        ...(filters.dueDateFrom && {
          gte: filters.dueDateFrom,
        }),

        ...(filters.dueDateTo && {
          lte: filters.dueDateTo,
        }),
      },
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: filters.skip,
      take: filters.take,
    }),

    prisma.task.count({
      where,
    }),
  ]);

  return {
    data,
    total,
  };
}
export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: "todo" | "in_progress" | "review" | "done";
    priority?: "low" | "medium" | "high" | "urgent";
    dueDate?:  string |Date | null;
  }
) {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  });
}
export async function findTaskById(
  taskId: string,
  projectId: string
) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      deletedAt: null,
    },
  });
}
export async function deleteTask(taskId: string) {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}
export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "in_progress" | "review" | "done"
) {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
    },
  });
}
export async function findTaskAssignment(
  taskId: string,
  userId: string
) {
  return prisma.taskAssignment.findUnique({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
  });
}

export async function assignTask(
  taskId: string,
  userId: string
) {
  return prisma.taskAssignment.create({
    data: {
      taskId,
      userId,
    },
  });
}

export async function unassignTask(
  taskId: string,
  userId: string
) {
  return prisma.taskAssignment.delete({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
  });
}