# Database Setup

This app is wired for PostgreSQL through `@vercel/postgres`.

## 1. Create a database

Use Neon or the Vercel Postgres/Neon integration.

## 2. Add environment variables

Create `.env` from `.env.example`:

```env
POSTGRES_URL="postgres://user:password@host/database?sslmode=require"
JWT_SECRET="replace-with-at-least-32-random-characters"
API_PORT="3001"
CORS_ORIGIN="http://localhost:5174,http://127.0.0.1:5174"
```

Never commit `.env`. It contains live secrets.

## 3. Create tables

Run:

```bash
npm run db:init
```

## 4. Run locally

In one terminal:

```bash
npm run api
```

In another terminal:

```bash
npm run dev
```

Vite proxies `/api` requests to `http://localhost:3001`.

## Security Baseline

- Secrets live in `.env`, not source code.
- `JWT_SECRET` must be at least 32 characters.
- The API rejects oversized JSON bodies.
- Helmet security headers are enabled.
- CORS is restricted to configured app origins.
- A simple per-IP rate limit protects API routes.
- SQL calls use parameterized queries through `@vercel/postgres`.
