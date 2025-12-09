# Multi-stage build for NestJS API
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY apps/api/package*.json ./
RUN npm ci --only=production

# Build stage
FROM base AS build
COPY apps/api/package*.json ./
RUN npm ci
COPY apps/api ./
COPY apps/api/prisma ./prisma
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY apps/api/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3001

CMD ["node", "dist/main"]
