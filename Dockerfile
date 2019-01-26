FROM node:10.13.0 as base

WORKDIR /piratejam

ADD . .

RUN yarn install && \
    yarn build

FROM node:10.13.0-alpine

WORKDIR /piratejam

COPY --from=base /piratejam/node_modules /piratejam/node_modules
COPY --from=base /piratejam/bin /piratejam/bin
COPY --from=base /piratejam/dist /piratejam/dist