import  prisma  from "../../config/prisma.js";

export async function createComment(
  taskId: string,
  authorId: string,
  content: string
) {
  return prisma.comment.create({
    data: {
      taskId,
      authorId,
      content,
    },
  });
}

export async function findCommentsByTask(taskId: string) {
  return prisma.comment.findMany({
    where: {
      taskId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function findCommentById(commentId: string) {
  return prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
}

export async function updateComment(
  commentId: string,
  content: string
) {
  return prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content,
    },
  });
}

export async function deleteComment(commentId: string) {
  return prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}