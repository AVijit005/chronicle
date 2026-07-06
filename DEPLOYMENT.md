# Deployment Guide

This document outlines the standard operating procedures for deploying the Chronicle v1.0.0 architecture to a production environment.

## Architecture Overview

Chronicle is deployed as a two-tier application:
1. **Frontend:** A statically built single-page application (SPA).
2. **Backend:** A stateful Node.js REST API interacting with a PostgreSQL database.

## Prerequisites

*   A managed PostgreSQL database (e.g., AWS RDS, Supabase, Neon).
*   A Node.js runtime environment for the backend (e.g., Render, Railway, Heroku, or AWS EC2).
*   A static hosting provider for the frontend (e.g., Vercel, Netlify, AWS S3 + CloudFront).

## Step 1: Database Migration

Before deploying the backend application code, ensure the production database schema is up-to-date.

1.  Set the `DATABASE_URL` environment variable to your production database URL.
2.  Run the Prisma deployment command from your CI/CD pipeline or deployment environment:
    ```bash
    npx prisma generate
    npx prisma migrate deploy
    ```

## Step 2: Backend Deployment

1.  **Environment Variables:** Ensure the following environment variables are securely injected into your backend environment:
    *   `PORT`: The port your server should listen on (usually `3000` or dynamically assigned).
    *   `DATABASE_URL`: Connection string for PostgreSQL.
    *   `JWT_SECRET`: A highly secure, randomly generated string for signing JWT tokens.
    *   `CLIENT_URL`: The origin URL of your production frontend (e.g., `https://chronicle.app`) for CORS configuration.

2.  **Build and Start:**
    The backend uses `ts-node` for execution or can be pre-compiled. For production, compilation is recommended:
    ```bash
    npx tsc --project tsconfig.server.json
    node dist/server.js
    ```
    *Alternatively, if using the unified Vite/Nitro output from recent builds:*
    ```bash
    node .output/server/index.mjs
    ```

## Step 3: Frontend Deployment

1.  **Environment Variables:** 
    *   Set `VITE_API_URL` to point to your live backend endpoint (e.g., `https://api.chronicle.app`).

2.  **Build:**
    ```bash
    npm run build
    ```

3.  **Hosting:**
    Deploy the generated `dist/` directory to your static hosting provider. Ensure that your hosting provider redirects all 404 requests to `index.html` to support client-side routing via `@tanstack/react-router`.

## Security Considerations

*   **CORS:** The backend is configured to restrict cross-origin requests. Ensure `CLIENT_URL` strictly matches your frontend domain. Do not use wildcard `*` origins in production.
*   **JWT Integrity:** Do not expose the `JWT_SECRET`. Rotate the secret if a compromise is suspected.
*   **Rate Limiting:** The backend utilizes `express-rate-limit`. If deploying behind a reverse proxy or load balancer (like AWS ALB or Cloudflare), ensure `app.set('trust proxy', 1)` is correctly configured so rate limiting uses the true client IP instead of the proxy IP.

## Monitoring and Maintenance

*   Monitor the application using tools like Sentry for error tracking and Datadog/New Relic for performance monitoring.
*   Regularly backup the PostgreSQL database according to your provider's recommended frequency.
