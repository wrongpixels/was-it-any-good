FROM node:20-alpine AS builder

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm ci
COPY . .

RUN npm run lint -w client
RUN npm run lint -w server

RUN npm run build -w client
RUN npm run build -w server

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 node

#copying just the content of the dist folder to avoid ugly nested structures
COPY --from=builder --chown=node:nodejs /app/server/dist/server/src/. /app/server/src/
#client dist goes to dist
COPY --from=builder --chown=node:nodejs /app/client/dist /app/client/dist
#and package json goes to the root to make our scripts run properly
COPY --from=builder --chown=node:nodejs /app/server/package*.json /app/

WORKDIR /app/server

RUN echo "=== FINAL FILE STRUCTURE ===" && \
    ls -la /app && \
    echo "=== /app/server ===" && \
    ls -la /app/server && \
    echo "=== /app/server/src ===" && \
    ls -la /app/server/src

RUN npm ci --omit=dev

USER node
EXPOSE 6060

CMD ["tini", "--", "node", "src/index.js"]

