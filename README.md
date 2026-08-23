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
