import { Queue } from "bullmq";
import { redis } from "../../config/redis.js";

export const taskQueue = new Queue("task-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});