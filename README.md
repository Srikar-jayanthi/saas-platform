# Multi-Tenant SaaS Project Management

A production-ready SaaS platform allowing multiple organizations to manage projects and tasks with complete data isolation.

## 🚀 Features

- **Multi-Tenancy**: Data isolation using `tenant_id` and subdomain identification.
- **RBAC**: Three roles (Super Admin, Tenant Admin, User).
- **Subscription Limits**: Automatic enforcement of user and project counts based on plans.
- **Dockerized**: Entire stack runs with a single command.
- **Audit Logging**: Tracking of critical actions.

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL 15.
- **Auth**: JWT (Stateless).
- **DevOps**: Docker, Docker Compose.

## ⚙️ Installation

1. Ensure Docker is installed.
2. Clone this repository.
3. Run `docker-compose up -d`.
4. Access the frontend at `http://localhost:3000`.

## 🔑 Test Credentials

See `submission.json` for all login details.

- **Super Admin**: <superadmin@system.com> / Admin@123
- **Demo Admin**: <admin@demo.com> / Demo@123
