import { AppError } from "../../utils/AppError.js";
import { findProjectById } from "../project/project.repository.js";
import { findMembership } from "../organization/organization.repository.js";
import { createTask as createTaskRepo, 
  findTasksByProject, 
  updateTask as updateTaskRepo , 
  findTaskById, 
  deleteTask as deleteTaskRepo,
  findTaskAssignment,
  updateTaskStatus as updateTaskStatusRepo,
  assignTask,
  unassignTask
} from "./task.repository.js";
import { taskQueue } from "./task.queue.js";


export async function createTask(
  orgId: string,
  projectId: string,
  data: {
    title: string;
    description?: string;
    status?: "todo" | "in_progress" | "review" | "done";
    priority?: "low" | "medium" | "high" | "urgent";
    dueDate?: string;
  }
) {
  const project = await findProjectById(
    projectId,
    orgId
  );

  if (!project) {
    throw new AppError(
      "Project not found in this organization",
      404
    );
  }

  return createTaskRepo(
    projectId,
    {
      ...data,
      dueDate: data.dueDate
        ? new Date(data.dueDate)
        : undefined,
    }
  );
}

export async function getTasks(
  orgId: string,
  projectId: string,
  filters: {
    status?: "todo" | "in_progress" | "review" | "done";
    priority?: "low" | "medium" | "high" | "urgent";
    assignee?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    page: number;
    limit: number;
  }
) {
  const project = await findProjectById(projectId, orgId);

  if (!project) {
    throw new AppError(
      "Project not found in this organization",
      404
    );
  }

  const page = Number(filters.page);
  const limit = Number(filters.limit);

  const skip = (page - 1) * limit;

  const result = await findTasksByProject(projectId, {
    status: filters.status,
    priority: filters.priority,
    assignee: filters.assignee,

    dueDateFrom: filters.dueDateFrom
      ? new Date(filters.dueDateFrom)
      : undefined,

    dueDateTo: filters.dueDateTo
      ? new Date(filters.dueDateTo)
      : undefined,

    skip,
    take: limit,
  });

  return {
    data: result.data,
    total: result.total,
    page,
    limit,
  };
}

export async function updateTask(
  orgId: string,
  projectId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: "todo" | "in_progress" | "review" | "done";
    priority?: "low" | "medium" | "high" | "urgent";
    dueDate?: string | null;
  }
) {
  const project = await findProjectById(projectId, orgId);

  if (!project) {
    throw new AppError(
      "Project not found in this organization",
      404
    );
  }

  const task = await findTaskById(taskId, projectId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return updateTaskRepo(taskId, {
    ...data,
    dueDate: data.dueDate 
      ? new Date(data.dueDate)
      : data.dueDate,
  });
}

export async function deleteTask(
  orgId: string,
  projectId: string,
  taskId: string
) {
  const project = await findProjectById(projectId, orgId);

  if (!project) {
    throw new AppError(
      "Project not found in this organization",
      404
    );
  }

  const task = await findTaskById(taskId, projectId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return deleteTaskRepo(taskId);
}


export async function updateTaskStatus(
  userId: string,
  orgId: string,
  projectId: string,
  taskId: string,
  status: "todo" | "in_progress" | "review" | "done"
) {
  const project = await findProjectById(projectId, orgId);

  if (!project) {
    throw new AppError(
      "Project not found in this organization",
      404
    );
  }

  const task = await findTaskById(taskId, projectId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }
     const membership = await findMembership(userId, orgId);
  if (!membership) {
    throw new AppError("You are not a member of this organization", 403);
  }

  if (membership.role === "member") {
    const assignment = await findTaskAssignment(
      taskId,
      userId
    );

    if (!assignment) {
      throw new AppError(
        "You are not assigned to this task",
        403
      );
    }
  }

  return updateTaskStatusRepo(taskId, status);
}

export async function assignTaskService(
  orgId: string,
  projectId: string,
  taskId: string,
  userId: string
) {
  const project = await findProjectById(projectId, orgId);

  if (!project) {
    throw new AppError(
      "Project not found in this organization",
      404
    );
  }

  const task = await findTaskById(taskId, projectId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const membership = await findMembership(userId, orgId);

  if (!membership) {
    throw new AppError(
      "User is not a member of this organization",
      403
    );
  }

  const existing = await findTaskAssignment(taskId, userId);

  if (existing) {
    throw new AppError(
      "User is already assigned to this task",
      409
    );
  }

  const assignment = await assignTask(taskId, userId);

  await taskQueue.add("task-assigned", {
    taskId,
    userId,
    orgId,
    
  },
   {
    jobId: `task-assigned-${taskId}-${userId}`
  }
);
  return assignment;
}
export async function unassignTaskService(
  orgId: string,
  projectId: string,
  taskId: string,
  userId: string
) {
  const project = await findProjectById(projectId, orgId);

  if (!project) {
    throw new AppError(
      "Project not found in this organization",
      404
    );
  }

  const task = await findTaskById(taskId, projectId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const assignment = await findTaskAssignment(
    taskId,
    userId
  );

  if (!assignment) {
    throw new AppError(
      "User is not assigned to this task",
      404
    );
  }

  return unassignTask(taskId, userId);
}