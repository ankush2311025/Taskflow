import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(1000).optional(),
    status: z.enum(["todo", "in_progress", "review","done"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    dueDate: z.iso.datetime().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    dueDate: z.iso.datetime().nullable().optional(),
  }),
});
export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "todo",
      "in_progress",
      "review",
      "done",
    ]),
  }),
});

export const assignTaskSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
  }),
});
export const getTasksSchema = z.object({
  query: z.object({
    status: z
      .enum(["todo", "in_progress", "review", "done"])
      .optional(),

    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .optional(),

    assignee: z.string().optional(),

    dueDateFrom: z.string().optional(),

    dueDateTo: z.string().optional(),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});