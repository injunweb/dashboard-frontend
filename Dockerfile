FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN yarn global add serve

CMD ["serve", "-s", "dist", "-l", "8080"]
