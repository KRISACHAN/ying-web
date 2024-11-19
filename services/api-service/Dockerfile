# Document: https://docs.docker.com/build/concepts/dockerfile/
#           https://docs.docker.com/reference/dockerfile/

FROM node:18.16.0 AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@8.5.1

RUN pnpm install

COPY . .

COPY .env ./

RUN pnpm run build

FROM node:18.16.0

RUN npm install -g pm2

WORKDIR /app

COPY --from=builder /app/dist-app ./dist-app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/.env ./

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
