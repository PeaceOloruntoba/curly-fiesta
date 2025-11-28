 # curly-fiesta API
 
 Backend for a meal planner app. Express + TypeScript, PostgreSQL, JWT auth with email OTP, rotating refresh tokens, admin management, and Cloudinary image uploads for recipes.
 
 ## Quick Start
 
 - **Install**
   - npm i
 - **Environment**
   - Copy .env.example to .env and fill required values (see Environment)
 - **Dev**
   - npm run dev
 - **Migrate** (if DATABASE_URL is set)
   - npm run migrate
 - **Health check**
   - GET http://localhost:4000/health -> { "ok": true, "service": "curly-fiesta-api" }
 
 ## Environment
 
 - **NODE_ENV**: development|test|production
 - **PORT**: default 4000
 - **CORS_ORIGIN**: e.g., http://localhost:5173
 - **DATABASE_URL**: Postgres URL
 - **JWT_SECRET**: strong secret (required in production)
 - **OTP_TTL_MINUTES**: default 10
 - **SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM**: email/OTP
 - **CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET**
 - **CLOUDINARY_FOLDER**: default "curly-fiesta/recipes"
 
 ## Security Model
 
 - **Access tokens**: JWT 24h lifetime. Payload includes `tv` (token_version) for revocation.
 - **Refresh tokens**: 30d lifetime. Stored server-side as hashed records with UA/IP. Rotated on every refresh.
 - **Revocation**:
   - Per-session: rotating refresh invalidates prior token immediately.
   - Global: bump `users.token_version` (via logout-all or admin) invalidates all access tokens.
 - **Cookies (web)**: httpOnly, SameSite=Lax, Secure in production.
 - **Mobile refresh**: Authorization header `Refresh <token>`.
 - **Rate limits**: Strict per-route on auth endpoints.
 
 ## Base URL
 
 - All routes are prefixed with `/v1`
 
 ## Auth
 
 - **Register**
   - POST /v1/auth/register
   - Body:
     ```json
     { "email":"user@example.com", "password":"P@ssw0rd!", "name":"Ada" }
     ```
   - Response (201):
     ```json
     { "message":"Registered. Verify OTP to activate account.", "otp":"123456" }
     ```
 
 - **Verify Email OTP**
   - POST /v1/auth/verify-otp
   - Body:
     ```json
     { "email":"user@example.com", "code":"123456" }
     ```
   - Response:
     ```json
     { "message":"Account verified" }
     ```
 
 - **Login**
   - POST /v1/auth/login
   - Body:
     ```json
     { "email":"user@example.com", "password":"P@ssw0rd!" }
     ```
   - Response (200):
     - Set-Cookie: `rt=<token>; HttpOnly; SameSite=Lax; Secure (prod)`
     ```json
     { "token":"<JWT-24h>" }
     ```
 
 - **Refresh Access Token**
   - POST /v1/auth/refresh
   - Web: uses `rt` cookie automatically
   - Mobile: header `Authorization: Refresh <refresh_token>`
   - Response (200):
     - Set-Cookie: `rt=<ROTATED>; HttpOnly`
     ```json
     { "token":"<JWT-24h>" }
     ```
 
 - **Logout (current session)**
   - POST /v1/auth/logout
   - Response:
     ```json
     { "message":"Logged out" }
     ```
 
 - **Logout all sessions**
   - POST /v1/auth/logout-all (Auth: Bearer <JWT>)
   - Response:
     ```json
     { "message":"Logged out from all devices" }
     ```
 
 - **Forgot/Reset Password (OTP)**
   - POST /v1/auth/forgot-password
     ```json
     { "email":"user@example.com" }
     ```
   - POST /v1/auth/reset-password
     ```json
     { "email":"user@example.com", "code":"654321", "password":"NewP@ss1" }
     ```
 
 ## Users
 
 - **Me**
   - GET /v1/users/me (Auth: Bearer <JWT>)
   - Response:
     ```json
     { "id":"...", "email":"...", "name": "..." }
     ```
 
 ## Recipes
 
 - **List recipes**
   - GET /v1/recipes
   - Response:
     ```json
     [
       { "id":1, "name":"Jollof Rice", "category":"lunch", "image_url":"https://..." }
     ]
     ```
 
 - **Get recipe**
   - GET /v1/recipes/:id
   - Response:
     ```json
     { "id":1, "name":"Jollof Rice", "category":"lunch", "image_url":"https://..." }
     ```
 
 - **Create recipe (admin)**
   - POST /v1/recipes (Auth: Bearer <admin JWT>)
   - Content-Type: multipart/form-data
   - Fields:
     - name: string (required)
     - category: string (required)
     - image: file (optional)
   - Response (201):
     ```json
     { "id":123 }
     ```
 
 - **Update recipe (admin)**
   - PUT /v1/recipes/:id (Auth: Bearer <admin JWT>)
   - Body (any subset):
     ```json
     { "name":"New Name", "category":"dinner" }
     ```
   - Response:
     ```json
     { "ok": true }
     ```
 
 - **Replace recipe image (admin)**
   - POST /v1/recipes/:id/image (Auth: Bearer <admin JWT>)
   - Content-Type: multipart/form-data
   - Fields:
     - image: file (required)
   - Response:
     ```json
     { "id":123, "image_url":"https://res.cloudinary.com/.../curly-fiesta/recipes/..." }
     ```
 
 - **Delete recipe (soft) (admin)**
   - DELETE /v1/recipes/:id (Auth: Bearer <admin JWT>)
   - Response: 204 No Content
 
 ## Meal Plans
 
 - **Get my plan**
   - GET /v1/meals/plan (Auth: Bearer <JWT>)
   - Response:
     ```json
     { "2025-11-28": { "breakfast": { "id": 1 }, "lunch": { "id": 2 } } }
     ```
 
 - **Replace my plan**
   - PUT /v1/meals/plan (Auth: Bearer <JWT>)
   - Body: arbitrary JSON plan (client references recipe ids)
   - Response:
     ```json
     { "ok": true }
     ```
 
 - **Clear my plan**
   - POST /v1/meals/plan/clear (Auth: Bearer <JWT>)
   - Response:
     ```json
     { "ok": true }
     ```
 
 ## Nutrition
 
 - **List / filter by recipe**
   - GET /v1/nutrition[?recipeId=<id>]
 - **Create**
   - POST /v1/nutrition
     ```json
     { "recipe_id":1, "calories":400, "protein_grams":20, "carbs_grams":50, "fat_grams":10 }
     ```
 - **Get/Update/Delete by id**
   - GET /v1/nutrition/:id
   - PUT /v1/nutrition/:id
   - DELETE /v1/nutrition/:id (soft)
 
 ## Pantry (auth)
 
 - **List/Create**
   - GET /v1/pantry
   - POST /v1/pantry
     ```json
     { "name":"Rice", "quantity":"2", "unit":"kg", "expires_at":"2025-12-31T00:00:00Z" }
     ```
 - **Item by id**
   - GET /v1/pantry/:id
   - PUT /v1/pantry/:id
   - DELETE /v1/pantry/:id (soft)
 
 ## Shopping (auth)
 
 - **List/Create**
   - GET /v1/shopping
   - POST /v1/shopping
     ```json
     { "name":"Tomatoes", "quantity":"1 crate" }
     ```
 - **Item by id**
   - GET /v1/shopping/:id
   - PUT /v1/shopping/:id
   - DELETE /v1/shopping/:id (soft)
 
 ## Stats (auth)
 
 - **List range**
   - GET /v1/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
 - **Create**
   - POST /v1/stats
     ```json
     { "stat_date":"2025-11-01", "calories":2000, "protein_grams":100, "carbs_grams":250, "fat_grams":60 }
     ```
 - **By id**
   - GET /v1/stats/:id
   - PUT /v1/stats/:id
   - DELETE /v1/stats/:id (soft)
 
 ## Admin (admin-only)
 
 - **List users**
   - GET /v1/admin/users[?q=email-substring]
 - **Set role**
   - POST /v1/admin/users/:id/role
     ```json
     { "role":"user" }
     ```
 - **Block user (soft delete)**
   - POST /v1/admin/users/:id/block
 - **Unblock user**
   - POST /v1/admin/users/:id/unblock
 - **Force logout all**
   - POST /v1/admin/users/:id/logout-all
 
 ## Error format
 
 - **Standard error**
   ```json
   { "error":"Message" }
   ```
 - **Common statuses**
   - 400: bad request (validation/missing)
   - 401: unauthorized/invalid token or revoked
   - 403: forbidden (admin-only) or account disabled
   - 404: not found
   - 409: conflict (e.g., email exists)
 
 ## Cloudinary
 
 - **Uploads**: Admin-only, backend uploads to Cloudinary; only `secure_url` saved as `recipes.image_url`.
 - **Env**: CLOUDINARY_* required. Optional `CLOUDINARY_FOLDER` (default `curly-fiesta/recipes`).
 
 ## Mobile Integration Tips
 
 - **Refresh**: store refresh token securely on device. Use `Authorization: Refresh <token>` to refresh.
 - **JWT**: refresh before 24h expiry; handle 401 by re-authenticating.
 
 ## Deployment Notes
 
 - **Server**: `src/index.ts` exports Express app and starts server (unless serverless env like Vercel).
 - **Migrations**: auto-run on boot when not serverless; otherwise run `npm run migrate` via CI/one-off job.
 - **CORS**: set `CORS_ORIGIN` to your web app origin(s).
 - **Secrets**: set strong `JWT_SECRET` and Cloudinary creds.
 
 ---
