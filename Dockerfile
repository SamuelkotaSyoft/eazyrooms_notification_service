FROM node:18

WORKDIR /usr/src/eazyrooms_notification_service

COPY package*.json ./

COPY . .

RUN npm install -g npm@9.6.7

RUN npm install

EXPOSE 3008

CMD ["node", "server.js"]