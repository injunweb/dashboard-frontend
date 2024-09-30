FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN yarn global add serve
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]