# ==============================================================================
# Multi-stage Dockerfile for Production MERN Real Estate Application
# ==============================================================================

# --- Stage 1: Build Frontend Client ---
FROM node:20-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# --- Stage 2: Production Server Runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install curl for container health check
RUN apk add --no-cache curl

# Install root/server dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server application files
COPY api/ ./api/
COPY nodemon.json ./

# Copy built frontend assets from client-builder stage
COPY --from=client-builder /app/client/dist ./client/dist

# Security hardening: use non-root user
USER node

EXPOSE 3000

# Container healthcheck using the /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "api/index.js"]
