FROM node:18.13 AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/api

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run prisma:generate
RUN npm run build

FROM node:18.13 AS builder

WORKDIR /home/api

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run prisma:generate
RUN npm run build

FROM node:18.13 AS production

ARG APP_PORT=3000
ARG APP_NAME=br-ipti-visao-backend
ARG NODE_ENV=production
ARG DATABASE_URL
ARG GIT_SHA
ARG GIT_BRANCH

ENV APP_PORT=${APP_PORT}
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_URL=${DATABASE_URL}
ENV GIT_SHA=${GIT_SHA}
ENV GIT_BRANCH=${GIT_BRANCH}

WORKDIR /home/api

COPY --from=builder /home/api ./

EXPOSE 3000

CMD ["sh", "-c", "npm run prisma:migrate && npm run start:prod"]
