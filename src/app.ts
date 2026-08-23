import express from "express";
import healthRoutes from './routes/health.routes.js'
import {errorMiddleware} from './middlewares/error.middleware.js'
import authRoutes from './modules/auth/auth.routes.js'
import organizationRoutes from "./modules/organization/organization.routes.js"
import projectRoutes from '../src/modules/project/project.routes.js'
import taskRoutes from './modules/Task/task.router.js'
import commentRoutes from './modules/comments/comment.routes.js'


const app = express();

app.use(express.json());


app.get("/", (req,res) => {
    res.status(200).json({
    status: "ok",
    service: "taskflow-api is running"
  });
});

app.use('/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', organizationRoutes)
app.use("/api/v1/organizations", projectRoutes);
app.use("/api/v1", taskRoutes )
app.use("/api/v1/comment", commentRoutes)
app.use(errorMiddleware); 

export default app;

