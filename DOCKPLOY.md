# Dockploy Deployment Guide

## Port

Set the container port to **3000**.

---

## Environment variables

Configure these in the Dockploy service settings under **Environment Variables**:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://user:pass@host:5432/db`) |
| `BETTER_AUTH_SECRET` | Random secret key for BetterAuth (min 32 chars) |
| `BETTER_AUTH_URL` | Public app URL (e.g. `https://app.etercloud.io`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `PTERODACTYL_API_URL` | Pterodactyl panel URL (e.g. `https://panel.etercloud.io`) |
| `PTERODACTYL_API_KEY` | Pterodactyl application API key |

> Do not set `NODE_ENV` — it is already set to `production` in the Dockerfile.

---

## Persistent volume — uploaded images

The app stores uploaded images in `/app/public/uploads` inside the container.
Without a persistent volume, uploads are lost on every redeploy.

### Configuration in Dockploy

1. Go to the service settings → **Mounts / Volumes**
2. Add a new volume:
   - **Type:** Volume
   - **Name:** `etercloud-uploads` (or any name)
   - **Container path:** `/app/public/uploads`

### Permissions

The container runs as the `bun` user (UID **1000**). The `/app/public/uploads` directory
is pre-created with the correct ownership in the Dockerfile.

However, when Docker mounts a named volume for the first time, it copies the directory
contents from the image (including the correct ownership). Subsequent mounts preserve
the volume data. This should work automatically.

If you ever see a **permission denied** error on uploads, run this once inside the container:

```sh
chown -R 1000:1000 /app/public/uploads
```

Or add it as a Dockploy **pre-deploy command**:

```sh
chown -R 1000:1000 /app/public/uploads || true
```

---

## Database migrations

**Do not run `prisma migrate dev` in production.** Use `migrate deploy` which only
applies already-generated migration files.

### Option A — Post-deploy command in Dockploy

In service settings → **Post-deploy command**:

```sh
bunx prisma migrate deploy
```

### Option B — Manual (one-off)

Connect to the running container and run:

```sh
bunx prisma migrate deploy
```

---

## Build notes

- The Prisma client is generated from `prisma/schema.prisma` **during the Docker build**
  (no `DATABASE_URL` required at build time — only schema parsing).
- `prisma/generated/` is excluded from the build context via `.dockerignore` and
  regenerated fresh on every build.
- Bun cache is preserved between builds via Docker layer cache (`--mount=type=cache`).

---

## Optional — Next.js standalone mode (smaller image)

Standalone mode bundles only the files needed to run the server, significantly reducing
the final image size.

**1. Update `next.config.ts`:**

```ts
const nextConfig: NextConfig = {
  output: 'standalone',
}
```

**2. Replace the final stage in `Dockerfile`:**

```dockerfile
FROM base AS final

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Standalone bundle already includes node_modules — no separate copy needed
COPY --from=build --chown=bun:bun /app/.next/standalone ./
COPY --from=build --chown=bun:bun /app/.next/static     ./.next/static
COPY --from=build --chown=bun:bun /app/public           ./public
COPY --from=build --chown=bun:bun /app/prisma           ./prisma

RUN mkdir -p /app/public/uploads && chown bun:bun /app/public/uploads

USER bun

EXPOSE 3000

CMD ["node", "server.js"]
```
