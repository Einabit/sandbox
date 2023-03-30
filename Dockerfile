FROM node:14-alpine

WORKDIR /app
RUN sh -c 'touch raw'

COPY package.json .
RUN npm i
COPY src ./src

EXPOSE 1337
CMD [ "node", "src/index.js" ]
