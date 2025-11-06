# curly-fiesta API

Backend for a meal planner app. Stateless-friendly (Vercel), PostgreSQL-backed, JWT auth with email OTP verification, and OTP-based forgot/reset password.

## Quick Start

- Install deps
  - npm i
  - npm i -D @types/pg
- Copy env
  - cp .env.example .env
  - Fill JWT_SECRET (required in production). Optional: DATABASE_URL, SMTP.
- Dev
  - npm run dev
- Health check
  - GET http://localhost:4000/health -> { ok: true, service: 'curly-fiesta-api' }

## Environment

- NODE_ENV: development|test|production
- PORT: default 4000
- CORS_ORIGIN: origin string. If unset, CORS is wide-open (for dev/multi-clients)
- DATABASE_URL: Postgres URL (optional for dev; required for DB-backed routes)
- JWT_SECRET: at least 16 chars (generated automatically in dev if missing)
- OTP_TTL_MINUTES: default 10
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM: optional; if missing, emails log warnings and are skipped

## Serverless (Vercel)

- The Express app is exported from src/index.ts and re-exported from api/index.ts for Vercel Serverless Functions.
- Migrations run only in non-serverless local boot. In Vercel, run migrations separately (GitHub Action or one-off job).
- Pooling: pg pool is lazy; if DATABASE_URL is missing, DB calls throw with clear logs.

## Auth Flow

1) Register -> email OTP -> verify -> login (JWT) -> refresh via cookie-stored refresh token
2) Forgot password -> OTP to email -> reset with OTP

Base URL: /api/v1

### Register
- POST /auth/register
- Body:
  {
    "email": "user@example.com",
    "password": "P@ssw0rd!",
    "name": "Ada"
  }
- Response (dev): 201
  {
    "message": "Registered. Verify OTP to activate account.",
    "otp": "123456"
  }

### Verify Email OTP
- POST /auth/verify-otp
- Body:
  { "email": "user@example.com", "code": "123456" }
- Response: 200 { "message": "Account verified" }

### Login
- POST /auth/login
- Body:
  { "email": "user@example.com", "password": "P@ssw0rd!" }
- Response: 200
  Set-Cookie: rt=...; HttpOnly
  { "token": "<JWT>" }
- Use Authorization: Bearer <JWT> on protected routes

### Refresh Access Token
- POST /auth/refresh
- Cookies: rt
- Response: 200
  Set-Cookie: rt=rotated; HttpOnly
  { "token": "<JWT>" }

### Logout
- POST /auth/logout
- Clears refresh cookie

### Forgot Password (OTP)
- POST /auth/forgot-password
- Body: { "email": "user@example.com" }
- Response: 200 { "message": "If the email exists, a reset code has been sent" }

### Reset Password with OTP
- POST /auth/reset-password
- Body:
  { "email": "user@example.com", "code": "654321", "password": "NewP@ss1" }
- Response: 200 { "message": "Password updated" }

## Users

- GET /users/me
- Headers: Authorization: Bearer <JWT>
- Response: { id, email, name }

## Meals

- GET /meals/plan
- Headers: Authorization: Bearer <JWT>
- Response: JSON plan object

- PUT /meals/plan
- Headers: Authorization: Bearer <JWT>
- Body: arbitrary JSON plan
- Response: { ok: true }

- POST /meals/plan/clear
- Headers: Authorization: Bearer <JWT>
- Response: { ok: true }

## Recipes

- GET /recipes
- Response: [ { id, name, category } ]

## Logging

- Pino structured logs and HTTP request logging. Pretty printing in dev.
- Failures log with error details and context (e.g., migration name, SQL attempted).

## Database & Migrations

- SQL migrations in src/db/migrations. Run automatically in local dev on boot if DATABASE_URL is set.
- Tables (core): users, otps (purpose: verify|password_reset), refresh_tokens, password_resets (legacy), recipes, user_meal_plans.

## CORS

- CORS is configured via helmet + cors. If CORS_ORIGIN is unset, origin: true enables wide-open for development and multi-client (web and mobile) integration.

## Mobile/Web Integration

- Use the same REST endpoints.
- For refresh, rely on HttpOnly cookie (web). For mobile, you may store refresh token manually by exposing it via custom flow if needed (current backend uses cookie only by default for safety).

## Deployment Notes

- Vercel: place api/index.ts as entry. Set env vars in Vercel dashboard. Use a managed Postgres (e.g., Supabase, Neon).
- Run migrations via CI/CD or one-off job before promoting traffic.
- Ensure JWT_SECRET is set and long in production.

## Nutrition

- GET /nutrition
- Query: recipeId (optional)
- Response: [ { id, recipe_id, calories, protein_grams, carbs_grams, fat_grams } ]

- POST /nutrition
- Body:
  {
    "recipe_id": 1,
    "calories": 400,
    "protein_grams": 20,
    "carbs_grams": 50,
    "fat_grams": 10
  }

- GET /nutrition/:id
- PUT /nutrition/:id
- DELETE /nutrition/:id (soft delete)

## Pantry (auth required)

Headers: Authorization: Bearer <JWT>

- GET /pantry
- POST /pantry
- Body:
  { "name": "Rice", "quantity": "2", "unit": "kg", "expires_at": "2025-12-31T00:00:00Z" }

- GET /pantry/:id
- PUT /pantry/:id
- DELETE /pantry/:id (soft delete)

## Shopping (auth required)

Headers: Authorization: Bearer <JWT>

- GET /shopping
- POST /shopping
- Body:
  { "name": "Tomatoes", "quantity": "1 crate" }

- GET /shopping/:id
- PUT /shopping/:id
- DELETE /shopping/:id (soft delete)

## Stats (auth required)

Headers: Authorization: Bearer <JWT>

- GET /stats?from=YYYY-MM-DD&to=YYYY-MM-DD
- POST /stats
- Body:
  { "stat_date": "2025-11-01", "calories": 2000, "protein_grams": 100, "carbs_grams": 250, "fat_grams": 60 }

- GET /stats/:id
- PUT /stats/:id
- DELETE /stats/:id (soft delete)

## Seeding

- Seed script: src/db/seed.ts
- Run (ESM):
  node --loader ts-node/esm src/db/seed.ts
- Seeds demo user:
  email: peaceoloruntoba22@gmail.com
  password: password (hashed)
  name: Peace Oloruntoba
