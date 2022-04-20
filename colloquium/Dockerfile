FROM node:16.13-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
COPY nginx ./nginx

RUN ls -a
RUN npm install --legacy-peer-deps
RUN npm run build

FROM nginx

COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
