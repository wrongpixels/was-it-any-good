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

RUN addgroup --system --grid 1001 nodejs
RUN adduser --system --uid 1001 node

COPY --from=builder --chown=node:nodejs /app/client/dist ./client/dist
COPY --from=builder --chown=node:nodejs /app/server/dist ./server/dist
COPY --from=builder --chown=nodejs:node /app/server/package*.json ./server/

WORKDIR /app/server
RUN npm ci --omit=dev

USER node
EXPOSE 6060

CMD ["tini", "--", "node", "dist/index.js"]

