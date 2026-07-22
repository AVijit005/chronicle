# syntax=docker/dockerfile:1
# Chronicle Backend — Production multi-stage build

ARG NODE_VERSION=22

# ── Stage 1: Build ──
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./
RUN npm install

COPY prisma ./prisma
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

# ── Stage 2: Production ──
FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 chronicle && \
    adduser --system --uid 1001 chronicle

COPY --from=builder --chown=chronicle:chronicle /app/dist ./dist
COPY --from=builder --chown=chronicle:chronicle /app/node_modules ./node_modules
COPY --from=builder --chown=chronicle:chronicle /app/package.json ./
COPY --from=builder --chown=chronicle:chronicle /app/prisma ./prisma

USER chronicle

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

STOPSIGNAL SIGTERM

CMD ["node", "dist/main"]
