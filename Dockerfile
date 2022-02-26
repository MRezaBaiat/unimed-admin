FROM node:16.13.2 AS BUILD_IMAGE

WORKDIR '/dist'

COPY ./package.json .
COPY ./yarn.lock .

COPY ./src ./src
COPY ./public ./public
COPY ./tsconfig.json .
COPY ./.eslintrc.json .

RUN yarn install --production
ARG CACHEBUST=1

RUN npm run build:release

EXPOSE 80

FROM nginx
COPY --from=BUILD_IMAGE /dist/build /usr/share/nginx/html
