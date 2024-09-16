FROM node:lts-alpine as builder
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN apk update && apk add git
RUN yarn && mv node_modules ../
COPY . .
RUN chown -R node /usr/src/app
RUN mv ../node_modules ./
RUN yarn build
USER node

FROM nginx:alpine as production-build
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]