import { AppError } from "../../utils/AppError.js";
import { findProjectById } from "../project/project.repository.js";
import  { findTaskById } from '../Task/task.repository.js'

import {
  createComment,
  findCommentsByTask,
  findCommentById,
  updateComment,
  deleteComment,
} from "./comment.repository.js";

export async function createCommentService(
  userId: string,
  orgId: string,
  projectId: string,
  taskId: string,
  content: string
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

  return createComment(taskId, userId, content);
}
export async function getCommentsService(
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

  return findCommentsByTask(taskId);
}
export async function updateCommentService(
  userId: string,
  commentId: string,
  content: string
) {
  const comment = await findCommentById(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.authorId !== userId) {
    throw new AppError(
      "You can only update your own comment",
      403
    );
  }

  return updateComment(commentId, content);
}
export async function deleteCommentService(
  userId: string,
  commentId: string
) {
  const comment = await findCommentById(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.authorId !== userId) {
    throw new AppError(
      "You can only delete your own comment",
      403
    );
  }

  return deleteComment(commentId);
}