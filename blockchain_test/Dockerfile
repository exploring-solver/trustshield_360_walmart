FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Compile contracts
RUN npm run compile

# Expose port
EXPOSE 8545

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8545/health || exit 1

# Start the blockchain server
CMD ["npm", "run", "start:server"] 