FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm install
COPY . .

RUN npm run lint --workspace-client
RUN npm run lint --workspace-server

ENV NODE_ENV=production
RUN cd client && npm run build 
RUN cd server && npm run build
