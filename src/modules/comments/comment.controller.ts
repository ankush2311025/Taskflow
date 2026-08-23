import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  createCommentService,
  getCommentsService,
  updateCommentService,
  deleteCommentService,
} from "./comment.service.js";

export const createCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await createCommentService(
      req.userId,
      req.params.orgId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.body.content
    );

    res.status(201).json({
      success: true,
      data: comment,
    });
  }
);
export const getCommentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const comments = await getCommentsService(
      req.params.orgId as string,
      req.params.projectId as string,
      req.params.taskId as string
    );

    res.status(200).json({
      success: true,
      data: comments,
    });
  }
);
export const updateCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await updateCommentService(
      req.userId,
      req.params.commentId as string,
      req.body.content
    );

    res.status(200).json({
      success: true,
      data: comment,
    });
  }
);
export const deleteCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteCommentService(
      req.userId,
      req.params.commentId as string
    );

    res.status(204).send();
  }
);