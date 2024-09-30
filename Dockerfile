FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn build

FROM pierrezemb/gostatic:alpine AS serve
COPY --from=build /app/build /srv/http
CMD ["gostatic", "-port", "8080", "-root", "/srv/http"]