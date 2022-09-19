FROM node:18-alpine

ADD package.json /tmp/package.json
RUN cd /tmp && npm i --omit=dev
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app
COPY . /app

RUN npm run build

CMD ["node", "dist/app.js"]
