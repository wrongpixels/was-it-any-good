FROM node:20-alpine AS builder

WORKDIR /app
ENV NODE_ENV=production

# root manifests + lockfile (npm workspaces)
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN npm ci
COPY . .

RUN npm run lint -w client
RUN npm run lint -w server

RUN npm run build -w client
RUN npm run build -w server

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

#copying just the content of the dist folder to avoid ugly nested structures
COPY --from=builder --chown=node:node /app/server/dist/server/src/. /app/server/src/
#client dist goes to dist
COPY --from=builder --chown=node:node /app/client/dist /app/client/dist
#we add shared
COPY --from=builder --chown=node:node /app/server/dist/shared /app/shared
#server package json for dependencies
COPY --from=builder --chown=node:node /app/server/package.json /app/server/
#and the root package to start the monorepo from
COPY --from=builder --chown=node:node /app/package.json /app/

RUN cd /app/server && npm install --omit=dev

USER node
EXPOSE 6060

CMD ["node", "/app/server/src/index.js"]