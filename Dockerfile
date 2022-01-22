###############################################################################
## Base image; used by builder and app images
FROM node:14-alpine as base

RUN apk update && apk upgrade && \
  apk add --no-cache openssl ca-certificates && \
  update-ca-certificates
RUN mkdir /home/node/app
RUN chown -R node /home/node/app

WORKDIR /home/node/app


###############################################################################
## Builder image

FROM base as builder

RUN apk add --no-cache wget make gcc g++ python2

COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY src src

RUN npm ci \
    && npm run build \
    && rm -rf node_modules \
    && npm ci --production 


###############################################################################
## App image

FROM base as app

COPY --from=builder --chown=node /home/node/app/node_modules node_modules
COPY --from=builder --chown=node /home/node/app/dist dist

USER node

ARG GIT_REF
ENV APP_VERSION=$GIT_REF

EXPOSE 3000

CMD /usr/local/bin/node ./dist/app.js