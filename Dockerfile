# syntax=docker/dockerfile:1

ARG BUN_VERSION=1.2

################################################################################
# Base — bun on Alpine Linux
FROM oven/bun:${BUN_VERSION}-alpine AS base
WORKDIR /app

################################################################################
# Production dependencies only
FROM base AS deps

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production

################################################################################
# Full install + build
FROM base AS build

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# Copy source (prisma/generated is excluded via .dockerignore — regenerated below)
COPY . .

# Generate Prisma client into prisma/generated/
# No DATABASE_URL needed — this step only reads the schema and generates TypeScript
RUN bunx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

################################################################################
# Production runtime
FROM base AS final

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --chown=bun:bun package.json .
COPY --from=deps  --chown=bun:bun /app/node_modules  ./node_modules
COPY --from=build --chown=bun:bun /app/.next         ./.next
COPY --from=build --chown=bun:bun /app/public        ./public
COPY --from=build --chown=bun:bun /app/prisma        ./prisma

# Create upload directory owned by bun before switching user.
# Mount this path as a persistent volume in Dockploy: /app/public/uploads
RUN mkdir -p /app/public/uploads && chown bun:bun /app/public/uploads

USER bun

EXPOSE 3000

CMD ["bun", "run", "start"]
