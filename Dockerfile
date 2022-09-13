FROM node:16-alpine

COPY ["package.json", "tsconfig.json", "/app/"]
COPY src /app/src
WORKDIR /app

RUN npm install && npm run build

CMD ["node", "dist/app.js"]
