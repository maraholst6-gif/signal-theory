FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY email-action-plans ./email-action-plans
RUN npm run build

# ─────────────────────────────────────────────
# Production image
# ─────────────────────────────────────────────

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY src/db/migrations ./dist/db/migrations
COPY load-templates.js ./
COPY email-action-plans ./email-action-plans

EXPOSE 3000

# Run migrations, load templates, then start server
CMD ["sh", "-c", "node dist/db/migrate.js && node load-templates.js && node dist/index.js"]
