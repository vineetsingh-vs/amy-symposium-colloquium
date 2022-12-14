# Stage one, build the app in separate container
FROM node:16.13-alpine as build

WORKDIR /usr

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY @types ./@types
COPY plugins ./plugins
COPY .env ./
COPY .env.example ./
COPY config.json ./

RUN npm install
RUN npm run build

# Stage two, run the built app
FROM node:16.13-alpine

WORKDIR /usr

RUN apk update
RUN apk add bash

COPY package.json ./

RUN npm install --only=production
COPY --from=build /usr/dist ./
COPY --from=build /usr/dist/src ./
COPY --from=build /usr/.env ./
COPY --from=build /usr/.env.example ./
COPY --from=build /usr/config.json ./
RUN rm -r src/
RUN npm install pm2 -g

EXPOSE 8080

CMD ["pm2-runtime", "index.js"]