# Stage one, build the app in separate container
FROM node:16.13-alpine as build

WORKDIR /usr

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY .env ./
COPY .env.example ./

RUN ls -a
RUN npm install
RUN npm run build

# Stage two, run the built app
FROM node:16.13-alpine

WORKDIR /usr

COPY package.json ./

RUN npm install --only=production
COPY --from=build /usr/build ./
COPY --from=build /usr/.env ./
COPY --from=build /usr/.env.example ./
RUN npm install pm2 -g

EXPOSE 8080

CMD ["pm2-runtime", "index.js"]