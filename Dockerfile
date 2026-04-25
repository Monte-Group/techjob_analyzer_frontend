# ----- deps -----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn --frozen-lockfile

# ----- builder -----
FROM deps AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# ----- runner -----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN mkdir -p .next/cache .next/server/app \
 && chown -R node:node /app

USER node

ENV NEXT_CACHE_DIR=/app/.next/cache
ENV PORT=3011
EXPOSE 3011

CMD ["node", "server.js"]