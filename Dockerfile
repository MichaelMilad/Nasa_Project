FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/

RUN chown -R node:node /app
USER node

RUN npm install --prefix client --omit=dev
RUN npm install --prefix server --omit=dev

COPY --chown=node:node client/ client/
COPY --chown=node:node server/ server/

RUN npm run build --prefix client

EXPOSE 8000

CMD [ "npm", "start", "--prefix", "server" ]