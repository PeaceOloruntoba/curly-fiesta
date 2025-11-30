 # curly-fiesta API
 
 Backend for a meal planner app. Express + TypeScript, PostgreSQL, JWT auth with OTP, rotating refresh tokens, admin management, and Cloudinary recipe images.
 
 Base URL: http://localhost:4000/v1
 
 ## Auth (for everyone)
 
 - POST /auth/register
   - Body
     ```json
     { "email":"user@example.com", "password":"P@ssw0rd!", "name":"Ada" }
     ```
   - 201
     ```json
     { "message":"Registered. Verify OTP to activate account.", "otp":"123456" }
     ```
   - Errors
     - 400 { "error":"Email and password required", "errorMessage":"Enter your email and password" }
     - 409 { "error":"Email already in use", "errorMessage":"Email already in use" }
 
 - POST /auth/verify-otp
   - Body
     ```json
     { "email":"user@example.com", "code":"123456" }
     ```
   - 200
     ```json
     { "message":"Account verified" }
     ```
   - Errors
     - 400 { "error":"Invalid code", "errorMessage":"Invalid verification code" }
     - 400 { "error":"Code expired", "errorMessage":"Verification code expired" }
     - 404 { "error":"User not found", "errorMessage":"Account not found" }
 
 - POST /auth/login
   - Body
     ```json
     { "email":"user@example.com", "password":"P@ssw0rd!" }
     ```
   - 200 (rt cookie set; 30d)
     ```json
     { "token":"<JWT-24h>", "user": { "id":"...", "email":"user@example.com", "name":"Ada", "role":"user" } }
     ```
   - Errors
     - 400 { "error":"Email and password required", "errorMessage":"Enter your email and password" }
     - 401 { "error":"Invalid credentials", "errorMessage":"Invalid email or password" }
     - 403 { "error":"Account not verified", "errorMessage":"Verify your email to continue" }
 
 - POST /auth/refresh
   - Web: uses rt cookie
   - Mobile: header `Authorization: Refresh <token>`
   - 200 (rt rotated)
     ```json
     { "token":"<JWT-24h>", "user": { "id":"...", "email":"user@example.com", "name":"Ada", "role":"user" } }
     ```
   - Errors
     - 401 { "error":"Missing token", "errorMessage":"Please sign in" }
     - 401 { "error":"Invalid token", "errorMessage":"Please sign in" }
     - 401 { "error":"Expired token", "errorMessage":"Please sign in" }
 
 - POST /auth/logout
   - 200
     ```json
     { "message":"Logged out" }
     ```
 
 - POST /auth/logout-all (Auth)
   - 200
     ```json
     { "message":"Logged out from all devices" }
     ```
 
 - POST /auth/forgot-password
   - Body
     ```json
     { "email":"user@example.com" }
     ```
   - 200 { "message":"If the email exists, a reset code has been sent" }
 
 - POST /auth/reset-password
   - Body
     ```json
     { "email":"user@example.com", "code":"654321", "password":"NewP@ss1" }
     ```
   - 200 { "message":"Password updated" }
 
 ---
 
 ## User APIs (Auth: Bearer <JWT>)
 
 ### Users
 - GET /users/me
   - 200
     ```json
     { "id":"...", "email":"user@example.com", "name":"Ada", "role":"user" }
     ```
   - Errors
     - 401 { "error":"Unauthorized", "errorMessage":"Please sign in" }
     - 404 { "error":"User not found", "errorMessage":"Account not found" }
 
 ### Recipes (public read)
 - GET /recipes
   - 200
     ```json
     [ { "id":1, "name":"Jollof Rice", "category":"lunch", "image_url":"https://..." } ]
     ```
 - GET /recipes/:id
   - 200
     ```json
     { "id":1, "name":"Jollof Rice", "category":"lunch", "image_url":"https://..." }
     ```
   - 404 { "error":"Not Found", "errorMessage":"Recipe not found" }
 
 ### Meals (user meal plan)
 - GET /meals/plan
   - 200: plan JSON
 - PUT /meals/plan
   - Body: arbitrary plan JSON referencing recipe ids
   - 200 { "ok": true }
 - POST /meals/plan/clear
   - 200 { "ok": true }
 
 ### Nutrition
 - GET /nutrition[?recipeId=1]
   - 200: list
 - GET /nutrition/:id
   - 200: item; 404 if not found
 - POST /nutrition
   - Body
     ```json
     { "recipe_id":1, "calories":400, "protein_grams":20, "carbs_grams":50, "fat_grams":10 }
     ```
   - 201 { "id":123 }
   - Errors: 400 { "error":"recipe_id required", "errorMessage":"Provide recipe_id" }
 - PUT /nutrition/:id
   - 200 { "ok": true } | 400 { "error":"No updatable fields", "errorMessage":"Nothing to update" }
 - DELETE /nutrition/:id
   - 204
 
 ### Pantry
 - GET /pantry
   - 200: list
 - GET /pantry/:id
   - 200: item; 404 item not found
 - POST /pantry
   - Body
     ```json
     { "name":"Rice", "quantity":"2", "unit":"kg", "expires_at":"2025-12-31T00:00:00Z" }
     ```
   - 201 { "id":123 }
   - Errors: 400 { "error":"name required", "errorMessage":"Provide name" }
 - PUT /pantry/:id
   - 200 { "ok": true } | 400 { "error":"No updatable fields", "errorMessage":"Nothing to update" }
 - DELETE /pantry/:id
   - 204
 
 ### Shopping
 - GET /shopping
 - GET /shopping/:id
 - POST /shopping
   - Body
     ```json
     { "name":"Tomatoes", "quantity":"1 crate" }
     ```
   - 201 { "id":123 }
   - Errors: 400 { "error":"name required", "errorMessage":"Provide name" }
 - PUT /shopping/:id
   - 200 { "ok": true } | 400 { "error":"No updatable fields", "errorMessage":"Nothing to update" }
 - DELETE /shopping/:id
   - 204
 
 ### Stats (calculated from meal plan + nutrition)
 - GET /stats/summary?period=daily|week|month
   - 200
     ```json
     {
       "period":"week",
       "range": { "from":"2025-11-24", "to":"2025-11-30" },
       "totals": { "calories": 12000, "protein_grams": 700, "carbs_grams": 900, "fat_grams": 400 },
       "days": [ { "date":"Monday", "weekday":"Monday", "totals": {"calories":...} } ]
     }
     ```
   - Errors
     - 400 { "error":"Invalid period", "errorMessage":"Choose daily, week or month" }
 
 ---
 
 ## Admin APIs (Auth: Bearer <JWT admin>)
 
 ### Users management
 - GET /admin/users[?q=search]
   - 200: array of { id, email, name, role, deleted_at }
 - POST /admin/users/:id/role
   - Body
     ```json
     { "role":"user" }
     ```
   - 200 { "ok": true }
   - Errors: 400 { "error":"Invalid role", "errorMessage":"Invalid role" }
 - POST /admin/users/:id/block
   - 200 { "ok": true }
 - POST /admin/users/:id/unblock
   - 200 { "ok": true }
 - POST /admin/users/:id/logout-all
   - 200 { "ok": true }
 
 ### Recipes management
 - POST /recipes (multipart)
   - Fields: name (req), category (req), image (file optional)
   - 201 { "id":123 }
   - Errors: 400 { "error":"name and category required", "errorMessage":"Provide name and category" }
 - PUT /recipes/:id
   - Body: any of { name, category }
   - 200 { "ok": true } | 400 { "error":"No updatable fields", "errorMessage":"Nothing to update" }
 - POST /recipes/:id/image (multipart, field "image")
   - 200 { "id":123, "image_url":"https://..." }
 - DELETE /recipes/:id
   - 204
 
 ---
 
 ## Error format (global)
 
 All errors return:
 ```json
 { "error":"Detailed message", "errorMessage":"Concise, user-friendly message" }
 ```
 Common statuses: 400, 401, 403, 404, 409, 500.
 
 ## Environment
 
 Required: JWT_SECRET, DATABASE_URL. Optional SMTP for OTP emails. Cloudinary for recipe images:
 - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 - CLOUDINARY_FOLDER (default: curly-fiesta/recipes)
 
 ## Notes
 - Access token: 24h; Refresh token: 30d (rotated on each refresh).
 - Mobile refresh via Authorization: Refresh <token>.
 - Cookies httpOnly; SameSite=Lax; Secure in production.
 
