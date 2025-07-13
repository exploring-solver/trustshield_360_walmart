# Multi-stage build for TrustShield Blockchain Node

# Stage 1: Build stage (compile contracts)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Compile contracts
RUN npm run compile

# Stage 2: Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled contracts from builder stage
COPY --from=builder /app/artifacts ./artifacts
COPY --from=builder /app/cache ./cache
COPY --from=builder /app/typechain-types ./typechain-types

# Copy source code
COPY . .

# Expose port
EXPOSE 8545

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8545/health || exit 1

# Start the blockchain server
CMD ["npm", "run", "start:server"] 