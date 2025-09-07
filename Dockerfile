FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
COPY package-lock.json ./
COPY client/package-lock.json ./client/
COPY server/package-lock.json ./server/

RUN npm ci
COPY . .

RUN npm run lint -w client
RUN npm run lint -w server
RUN npm run build -w client
RUN npm run build -w server

FROM node:20-alpine AS final
WORKDIR /application
ENV NODE_ENV=production

RUN apk add --no-cache tini
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 node

COPY --from=builder --chown=node:nodejs /app/server/dist/server/src/. /application/server/src/
COPY --from=builder --chown=node:nodejs /app/client/dist /application/client/dist
COPY --from=builder --chown=node:nodejs /app/server/dist/shared /application/shared

COPY --from=builder --chown=node:nodejs /app/server/package.json /application/server/package.json
COPY --from=builder --chown=node:nodejs /app/server/package-lock.json /application/server/package-lock.json

RUN cd /application/server && npm ci --omit=dev

USER node
EXPOSE 6060

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "/application/server/src/index.js"]