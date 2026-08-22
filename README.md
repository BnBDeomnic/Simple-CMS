# Simple CMS

A blog CMS with a public homepage and a secure admin dashboard, built as a decoupled REST API (Laravel) + SPA (React) application.

**Live frontend demo**: https://frontend-fawn-nine-13.vercel.app *(the backend runs locally — see setup below to run the full stack with real data; the live frontend alone won't be able to fetch posts without a running backend it can reach)*

## Features

- **Multi-user system** with two roles:
  - **Admin** — full access: manage users, all posts, and categories
  - **Author** — can only create/edit/delete their own posts; can view categories but not manage them
- **Post management** — create, read, update, delete, with a rich text editor (Tiptap), draft/published status, and a "Featured" flag
- **Categories** — create and assign categories to posts (admin-managed)
- **Admin dashboard** — manage posts, categories, and users, protected by login
- **Public homepage** — lists published posts with:
  - Live search (title, case-insensitive)
  - Filter by category
  - **Latest** page (newest posts, no filters)
  - **Top 10** page (featured posts first, filled out with the latest)

## Tech Stack

- **Backend**: Laravel 13 (REST API only, no Blade views), PostgreSQL, Laravel Sanctum (token-based auth)
- **Frontend**: React 19 + TypeScript + Vite, React Router, TanStack Query, Tailwind CSS, shadcn/ui, Tiptap, Framer Motion
- **Package managers**: Composer (backend), pnpm (frontend)

## Project Structure

```
Simple CMS/
├── backend/     Laravel REST API
├── frontend/    React + Vite SPA
└── README.md
```

## Prerequisites

- PHP 8.2+ with the `pdo_pgsql` extension enabled, and Composer
- PostgreSQL (running locally, or any PostgreSQL connection string)
- Node.js 20+ and [pnpm](https://pnpm.io/)

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your database connection:

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=simple_cms
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Create the database (e.g. via `psql` or any Postgres GUI client):

```sql
CREATE DATABASE simple_cms;
```

Run migrations and seed demo data:

```bash
php artisan migrate --seed
```

Start the dev server:

```bash
php artisan serve
```

The API will be available at `http://127.0.0.1:8000`.

## Frontend Setup

```bash
cd frontend
pnpm install
cp .env.example .env
```

Make sure `frontend/.env` points to your backend:

```
VITE_API_URL=http://127.0.0.1:8000
```

Start the dev server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`.

## Default Login Credentials

Seeded by `php artisan migrate --seed`:

| Role   | Email               | Password |
|--------|----------------------|----------|
| Admin  | admin@gmail.com      | 123      |
| Author | author@gmail.com     | 123      |
| Author | dewi@gmail.com       | 123      |

Log in at `http://localhost:5173/admin/login`.

## Deployment Notes

The backend (`backend/`) is a standalone Laravel REST API and the frontend (`frontend/`) is a standalone React SPA — they can be deployed to any PHP-capable host and any static/Node host respectively, as long as `VITE_API_URL` (frontend) and `FRONTEND_URL`/CORS config (backend) are pointed at each other. A `backend/Dockerfile` is included for container-based hosts.

- **Database**: this project was tested against a local PostgreSQL instance and [Neon](https://neon.tech) (serverless Postgres) for production.
- **Frontend**: deployed to [Vercel](https://vercel.com) — **Root Directory** set to `frontend`. To point it at a live backend, set the `VITE_API_URL` environment variable in the Vercel project settings to your deployed backend URL and redeploy.
- **Backend**: not deployed to a public host in this submission. Several free container-hosting platforms were tried (Render, Koyeb, SnapDeploy, Railway), but each required credit card verification (or had an already-exhausted free trial) to run a Docker-based web service — no credit card was available to complete this step. The backend runs correctly locally per the setup steps above, and includes a `backend/Dockerfile` ready for any Docker-based host if a live deployment is needed later (once a valid payment method for verification is available, deployment is just: connect the repo, set **Root Directory** to `backend`, add the environment variables listed in `backend/.env.example`, and deploy).
