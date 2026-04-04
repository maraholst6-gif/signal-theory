FROM node:20-alpine AS builder

WORKDIR /build

COPY backend/package*.json ./
RUN npm ci

COPY backend/tsconfig.json ./
COPY backend/src ./src
COPY backend/email-action-plans ./email-action-plans
RUN npm run build

# ─────────────────────────────────────────────
# Production image
# ─────────────────────────────────────────────

FROM node:20-alpine

WORKDIR /srv

ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /build/dist ./dist
COPY backend/src/db/migrations ./dist/db/migrations
COPY backend/load-templates.js ./
COPY backend/email-action-plans ./email-action-plans

# Copy frontend static files so Express can serve them
COPY app ./app

EXPOSE 3000

CMD ["sh", "-c", "node dist/db/migrate.js && node load-templates.js && node dist/index.js"]
