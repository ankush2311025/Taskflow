import { Worker } from "bullmq";
import { redis } from "../../config/redis.js";
import prisma from "../../config/prisma.js";
import { sendTaskAssignmentEmail } from "../../services/email.service.js";

console.log("Starting task worker...");

export const taskWorker = new Worker(
  "task-queue",
  async (job) => {
    if (job.name === "task-assigned") {
      console.log("Task assigned job received:", job.data);

      const { taskId, userId } = job.data;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error("Assigned user not found");
      }

      try {
        await sendTaskAssignmentEmail(
          user.email,
          taskId
        );

        console.log(
          `Task assignment email sent to ${user.email}`
        );
      } catch (error) {
        console.error(
          `Failed to send task assignment email to ${user.email}:`,
          error
        );

        throw error;
      }
    }
  },
  {
    connection: redis,
  }
);