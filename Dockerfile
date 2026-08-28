FROM node:22-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
ARG BUILD_MODE=uat
RUN yarn build:${BUILD_MODE}

FROM nginx:1.27-alpine AS runtime
ARG BUILD_MODE=uat
COPY nginx_${BUILD_MODE}.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
