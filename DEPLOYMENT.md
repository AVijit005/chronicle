# Chronicle Deployment Guide

This document outlines the procedures, configurations, and best practices for deploying Chronicle v1.0.0 to production environments. Chronicle is a decoupled full-stack application consisting of a React (Vite/TanStack) frontend, a NestJS backend, and a PostgreSQL database managed via Prisma.

---

## Local Development

For testing production builds locally before deployment:

1. **Database:** Ensure your local PostgreSQL instance is running.
2. **Environment:** Verify `.env` values map to your local database and backend ports.
3. **Build Frontend:**
   ```bash
   npm install
   npm run build
   npm run preview
   ```
4. **Build Backend:**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run build
   npm run start:prod
   ```

---

## Docker

If containerizing the application, you can utilize Docker and `docker-compose`.

### Example `docker-compose.yml` Structure

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: chronicle
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://user:password@db:5432/chronicle?schema=public"
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      VITE_API_BASE_URL: "http://localhost:3000/api"
```

*Note: Ensure multi-stage Dockerfiles are utilized for both the frontend (serving static files via Nginx or Node) and the backend.*

---

## Frontend Deployment (Vercel)

Vercel is the recommended hosting provider for the Chronicle frontend due to its excellent support for Vite and React SPA routing.

1. **Connect Repository:** Link your GitHub/GitLab repository to Vercel.
2. **Framework Preset:** Select **Vite** (Vercel should auto-detect this).
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist` (or `.output/public` if using Nitro/TanStack Start).
5. **Environment Variables:**
   * Set `VITE_API_BASE_URL` to your production backend URL (e.g., `https://api.chronicle.com`).
6. **Deploy:** Click Deploy. Vercel will automatically handle SPA routing fallbacks.

---

## Backend Deployment (Render)

Render offers straightforward deployment for Node.js APIs like NestJS.

1. **Create Web Service:** Connect your repository and select the backend root directory.
2. **Environment:** Node.js.
3. **Build Command:**
   ```bash
   npm install && npx prisma generate && npm run build
   ```
4. **Start Command:**
   ```bash
   npm run start:prod
   ```
5. **Environment Variables:**
   * Provide `DATABASE_URL`, `JWT_SECRET`, and any required CORS origin domains.

---

## Database Deployment (PostgreSQL)

Chronicle requires a PostgreSQL database. Recommended providers include:
* **Supabase**
* **Neon (Serverless Postgres)**
* **AWS RDS / DigitalOcean Managed Databases**

Obtain the connection pool URL and supply it to the backend via the `DATABASE_URL` environment variable.

---

## Prisma

Prisma manages the database schema and migrations. 

### Migration Commands

**During Deployment (CI/CD Pipeline):**
Run the following command *before* starting the production server to ensure the database schema matches the application code:
```bash
npx prisma migrate deploy
```

**Local/Development Schema Updates:**
```bash
npx prisma migrate dev --name feature_name
```

---

## Environment Variables & Secrets

### Frontend Secrets
*(Do not place sensitive keys in the frontend environment)*
* `VITE_API_BASE_URL`: URL of the production backend API.

### Backend Secrets
* `DATABASE_URL`: Full connection string to the PostgreSQL database.
* `JWT_SECRET`: A strong, randomly generated string for signing session tokens.
* `CORS_ORIGIN`: The exact URL of the deployed frontend (e.g., `https://chronicle-app.vercel.app`) to restrict cross-origin requests.
* `PORT`: Usually injected by the hosting provider (default 3000).

---

## Production Build Commands

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
npx prisma generate
npm run build
```

---

## Production Checklist

- [ ] All environment variables are set in production environments.
- [ ] `VITE_API_BASE_URL` points to the live backend, not `localhost`.
- [ ] `CORS_ORIGIN` on the backend explicitly allows the frontend domain.
- [ ] `DATABASE_URL` uses a pooled connection string if required by your provider.
- [ ] `JWT_SECRET` is strong and securely stored.
- [ ] Database migrations (`prisma migrate deploy`) have been executed successfully.
- [ ] Mock data flag (if any exist) is completely disabled.

---

## Health Checks

Implement and verify health check endpoints to ensure the backend is available.
* Configure your hosting provider (e.g., Render) to ping `/api/health` (if implemented) or `/api/status`.
* Ensure the endpoint checks database connectivity (via `prisma.$queryRaw\`SELECT 1\``).

---

## Rollback Strategy

1. **Frontend:** Use Vercel's instant rollback feature to revert to the previous successful deployment.
2. **Backend:** Revert the commit in Git and trigger a redeploy on Render.
3. **Database:** Be extremely cautious with down-migrations. Rely on automated database backups (e.g., Supabase point-in-time recovery) if a schema change corrupts production data.

---

## Monitoring Recommendations

To maintain a healthy production state, integrate the following:
* **Error Tracking:** Sentry (Frontend & Backend exceptions).
* **Performance:** Vercel Analytics / Web Vitals.
* **Database Metrics:** Monitor connection pooling limits and query latency via your database provider dashboard.

---

## Common Deployment Issues & Troubleshooting

**Issue: Frontend returns 404 on refresh.**
* *Cause:* SPA routing misconfiguration.
* *Fix:* Ensure Vercel is configured to rewrite all routes to `index.html` (Vercel does this automatically for Vite presets, but verify `vercel.json` if issues persist).

**Issue: CORS Errors in the Browser Console.**
* *Cause:* Backend is rejecting requests from the frontend domain.
* *Fix:* Verify the `CORS_ORIGIN` environment variable on the backend matches the frontend domain exactly (no trailing slashes).

**Issue: Prisma Initialization Errors (e.g., "Cannot find module '@prisma/client'").**
* *Cause:* Prisma client was not generated during the build step.
* *Fix:* Ensure `npx prisma generate` runs immediately after `npm install` in your build scripts.

**Issue: Database Connection Timeouts.**
* *Cause:* IP Allowlisting or connection limits.
* *Fix:* Ensure your database provider allows connections from your backend provider's IP range. Consider using Prisma Accelerate or a connection pooler (like PgBouncer).

---

## Security Recommendations

* **HTTPS Only:** Ensure both frontend and backend are served exclusively over HTTPS.
* **Strict Transport Security (HSTS):** Enable HSTS headers on the backend.
* **Rate Limiting:** Implement rate limiting middleware on the NestJS backend to protect against brute-force attacks on authentication endpoints.
* **Secret Management:** Never commit `.env` files. Use the environment variable management dashboards provided by Vercel and Render.
