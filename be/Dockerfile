#Important: The docker build command needs to be run from monorepo root context!

FROM node:alpine3.21

RUN npm install -g @dotenvx/dotenvx nodemon ts-node

WORKDIR /app

COPY package.json .
COPY shared/package.json shared/package.json
COPY be/package.json be/package.json
RUN yarn install

COPY shared shared
COPY be be

RUN yarn workspace @app/shared build

WORKDIR /app/be
EXPOSE 8080

CMD ["yarn", "dev"]


