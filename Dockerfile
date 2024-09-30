FROM node:alpine AS builder

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:alpine
WORKDIR /app

COPY --from=builder /app/build ./build

RUN yarn global add serve

CMD ["serve", "-s", "build", "-l", "8080"]