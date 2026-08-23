# TaskFlow

A production-oriented backend task management system built with **Node.js, TypeScript, Express, PostgreSQL, Prisma, Redis, BullMQ, JWT and Docker**.

TaskFlow provides organization-based task management with authentication, role-based access control, project management, task management, task assignments, comments, background job processing and email notifications.

---

## Features

- JWT-based authentication
- Access and refresh token system
- Organization management
- Organization membership
- Role-Based Access Control (RBAC)
- `org_admin` and `member` roles
- Project management
- Task management
- Task status and priority management
- Task filtering and pagination
- Task assignment and unassignment
- Duplicate task assignment prevention
- Task comments
- Project dashboard
- PostgreSQL database with Prisma ORM
- Redis-based background processing
- BullMQ task queue
- Dedicated background worker
- Asynchronous task assignment emails
- Automatic job retries with exponential backoff
- Request validation using Zod
- Centralized application error handling
- Dockerized API, worker, PostgreSQL and Redis

---

# Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| TypeScript | Programming language |
| Express.js | REST API |
| PostgreSQL | Primary database |
| Prisma | ORM |
| Redis | Queue backend |
| BullMQ | Background job processing |
| Nodemailer | Email delivery |
| JWT | Authentication |
| Zod | Request validation |
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |

---

# Architecture

TaskFlow follows a layered backend architecture.

```text
                    ┌──────────────────┐
                    │      Client      │
                    │ Postman / Frontend│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Express API    │
                    │     :3000        │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌───────────┐   ┌──────────┐   ┌───────────┐
        │ PostgreSQL│   │  Redis   │   │ JWT / RBAC│
        └─────┬─────┘   └────┬─────┘   └───────────┘
              │              │
              ▼              ▼
           Prisma       BullMQ Queue
                             │
                             ▼
                    ┌──────────────────┐
                    │  Task Worker     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Email Service    │
                    │   Nodemailer     │
                    └──────────────────┘
Request Flow
Route
  ↓
Authentication
  ↓
RBAC
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
Task Assignment Flow
Assign Task
    ↓
Validate Membership
    ↓
Create Assignment
    ↓
BullMQ → Redis
    ↓
Worker
    ↓
Email Notification

The email is processed asynchronously, so the API does not wait for email delivery.

Database

Main entities:

User
Organization
OrgMember
Project
Task
TaskAssignment
Comment
RefreshToken

Relationships:

User ───< OrgMember >─── Organization
Organization ───< Project ───< Task
Task ───< TaskAssignment >─── User
Task ───< Comment >─── User
User ───< RefreshToken

Task assignments are protected by:

Application validation
        +
Database unique constraint
        +
Deterministic BullMQ job ID

Database constraint:

@@unique([taskId, userId])
Authentication & RBAC

Authentication uses JWT access and refresh tokens.

Protected requests:

Authorization: Bearer <access_token>

Roles:

Permission	Admin	Member
Manage Organization	✅	❌
Create Project	✅	❌
View Projects	✅	✅
Create Task	✅	❌
View Tasks	✅	✅
Update Task	✅	✅
Delete Task	✅	❌
Assign Task	✅	❌
Update Assigned Task Status	✅	✅
Comments	✅	✅
Background Jobs

Queue:

task-queue

Job:

task-assigned

Example payload:

{
  "taskId": "<task-id>",
  "userId": "<user-id>",
  "orgId": "<organization-id>"
}

Worker:

node dist/src/modules/Task/task.worker.js

Jobs use:

3 attempts
Exponential backoff
5 second initial delay
Docker

The application runs as four services:

taskflow-api
taskflow-worker
taskflow-postgres
taskflow-redis

Start everything:

docker compose up -d --build

Check services:

docker compose ps

Stop:

docker compose down

API:

http://localhost:3000

API Base URL:

http://localhost:3000/api/v1

Logs:

docker logs -f taskflow-api
docker logs -f taskflow-worker
docker logs -f taskflow-postgres
docker logs -f taskflow-redis
Environment Variables

Create a .env file using .env.example as the template.

PORT=3000

DB_PASSWORD=your_database_password
DATABASE_URL=postgresql://taskflow:your_database_password@localhost:5432/taskflow

REDIS_URL=redis://localhost:6379

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

Never commit .env or real credentials to GitHub.

Local Development
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
Project Structure
Taskflow/
├── src/
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── comments/
│   │   ├── organization/
│   │   ├── project/
│   │   └── Task/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── .gitignore
└── README.md
API Documentation

Complete API documentation is maintained in Postman, including:

All endpoints
Request bodies
Parameters
Authentication
Authorization
Example requests and responses

Open TaskFlow API Collection →

Error Handling

Centralized error handling with AppError.

Common responses:

200  Success
201  Created
204  Deleted
400  Bad Request
401  Unauthorized
403  Forbidden
404  Not Found
409  Conflict
500  Internal Server Error
Future Improvements
Swagger / OpenAPI
Automated unit & integration tests
CI/CD
Rate limiting
Structured logging
Monitoring & metrics
Kubernetes deployment
Horizontal worker scaling
Open TaskFlow API Collection →
