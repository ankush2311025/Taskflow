import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendTaskAssignmentEmail(
  to: string,
  taskId: string
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Task Assigned",
    text: `You have been assigned a task. Task ID: ${taskId}`,
  });
}