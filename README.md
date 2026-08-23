# TaskFlow

A backend task management system built with **Node.js, TypeScript, Express, PostgreSQL, Prisma, Redis, BullMQ, JWT and Docker**.

TaskFlow supports organization-based task management, RBAC, projects, tasks, assignments, comments and asynchronous email notifications.

## Features

- JWT access + refresh authentication
- Organization and member management
- Role-Based Access Control (`org_admin`, `member`)
- Project and task management
- Task filtering and pagination
- Task assignment / unassignment
- Duplicate assignment protection
- Task comments
- Zod request validation
- PostgreSQL + Prisma
- Redis + BullMQ background jobs
- Asynchronous task assignment emails
- Automatic job retries with exponential backoff
- Dockerized API, worker, PostgreSQL and Redis

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + TypeScript | Backend |
| Express.js | REST API |
| PostgreSQL | Database |
| Prisma | ORM |
| Redis + BullMQ | Background jobs |
| JWT | Authentication |
| Zod | Validation |
| Nodemailer | Email |
| Docker Compose | Infrastructure |

## Architecture

```text
Client / Postman
      │
      ▼
 Express API
      │
 ┌────┼───────────────┐
 ▼    ▼               ▼
DB   Redis          JWT/RBAC
     │
     ▼
 BullMQ Queue
     │
     ▼
 Task Worker
     │
     ▼
 Nodemailer → Email
```

Application flow:

```text
Route → Auth → RBAC → Validation → Controller → Service → Repository → Prisma → PostgreSQL
```

Task assignment:

```text
Assign Task → DB Assignment → BullMQ → Redis → Worker → Email
```

## Database

Main entities:

```text
User
Organization
OrgMember
Project
Task
TaskAssignment
Comment
RefreshToken
```

Key relationships:

```text
User ───< OrgMember >─── Organization
Organization ───< Project ───< Task
Task ───< TaskAssignment >─── User
Task ───< Comment >─── User
User ───< RefreshToken
```

Task assignments are protected by application validation and:

```prisma
@@unique([taskId, userId])
```

## Authentication & RBAC

Protected requests use:

```http
Authorization: Bearer <access_token>
```

Roles:

| Operation | Admin | Member |
|---|:---:|:---:|
| Manage Organization | ✅ | ❌ |
| Create Project | ✅ | ❌ |
| View Projects | ✅ | ✅ |
| Create Task | ✅ | ❌ |
| View Tasks | ✅ | ✅ |
| Update Task | ✅ | ✅ |
| Delete Task | ✅ | ❌ |
| Assign Task | ✅ | ❌ |
| Update Assigned Task Status | ✅ | ✅ |
| Comments | ✅ | ✅ |

## API Documentation

### Swagger / OpenAPI

Swagger UI is available locally at:

**http://localhost:3000/api-docs**

Raw OpenAPI specification:

**http://localhost:3000/api-docs/openapi.json**

The OpenAPI specification documents request bodies, parameters, authentication, responses and error responses for the implemented API.

### Postman

The ready-to-import collection is available at:

`postman/TaskFlow.postman_collection.json`

Import it into Postman. The collection uses `{{baseUrl}}` and automatically captures authentication/resource IDs during the setup flow.

## Background Jobs

Queue:

```text
task-queue
```

Job:

```text
task-assigned
```

Jobs are configured with:

```text
3 attempts
Exponential backoff
5 second initial delay
```

Worker command:

```bash
node dist/src/modules/Task/task.worker.js
```

## Docker

Services:

```text
taskflow-api
taskflow-worker
taskflow-postgres
taskflow-redis
```

Start:

```bash
docker compose up -d --build
```

Check:

```bash
docker compose ps
```

Stop:

```bash
docker compose down
```

Logs:

```bash
docker logs -f taskflow-api
docker logs -f taskflow-worker
```

API:

```text
http://localhost:3000
```

## Environment

Create `.env` from `.env.example`.

```env
PORT=3000

DB_PASSWORD=your_postgres_password
DATABASE_URL=postgresql://taskflow:your_postgres_password@localhost:5432/taskflow

REDIS_URL=redis://localhost:6379

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

Never commit `.env` or real credentials.

## Local Development

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

## Project Structure

```text
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
│   └── docs/
│
├── prisma/
├── docs/
│   └── openapi.json
├── postman/
│   └── TaskFlow.postman_collection.json
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
└── README.md
```

## Error Handling

Centralized error handling is used with common responses:

```text
200  Success
201  Created
204  No Content
400  Bad Request
401  Unauthorized
403  Forbidden
404  Not Found
409  Conflict
500  Internal Server Error
```

## Security

- JWT authentication
- Password hashing
- Refresh token persistence
- Organization-level authorization
- Task assignment authorization
- Zod validation
- Database unique constraints
- Environment-based secrets
- `.env` excluded from Git

## Future Improvements

- Automated unit/integration tests
- CI/CD
- Rate limiting
- Structured logging
- Monitoring and metrics
- Kubernetes deployment
- Horizontal worker scaling

## License

Developed for backend engineering and educational purposes.
