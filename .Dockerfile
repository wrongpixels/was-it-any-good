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
#we add shared
COPY --from=builder --chown=node:nodejs /app/server/dist/shared /app/shared
#server package json for dependencies
COPY --from=builder --chown=node:nodejs /app/server/package*.json /app/server/
#and the root package to start the monorepo from
COPY --from=builder --chown=node:nodejs /app/package*.json /app/

#we install the server dependencies
RUN cd /app/server && npm ci --omit=dev

#and we add an entrypoint that prints our structure (railway will ignore our logs on build)
COPY --chown=node:nodejs server/entrypoint.sh /app/server/entrypoint.sh
RUN chmod +x /app/server/entrypoint.sh

USER node
EXPOSE 6060

#we run both the entrypoint and our index
CMD ["tini", "--", "/app/server/entrypoint.sh", "node", "/app/server/src/index.js"]


