FROM node:14-alpine

WORKDIR /app

COPY src ./src
COPY package.json .

RUN npm i

EXPOSE 1337
CMD [ "node", "src/index.js" ]
