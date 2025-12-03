FROM node:alpine3.21

RUN npm install -g @dotenvx/dotenvx nodemon ts-node

WORKDIR /app

COPY package*.json .
RUN yarn install
COPY . .
EXPOSE 3000

CMD ["yarn", "dev"]


