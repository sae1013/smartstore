FROM node:20-bookworm-slim AS base
WORKDIR /app

# Install production dependencies first so they can be cached.
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Build the NestJS application with dev dependencies available.
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# Remove devDependencies to keep the runtime image slim.
RUN npm prune --omit=dev

# Final lightweight runtime image.
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
