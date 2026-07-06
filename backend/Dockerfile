# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy built assets from builder
COPY --from=builder /usr/src/app/dist ./dist

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs

EXPOSE 5001

CMD ["node", "dist/src/main"]
