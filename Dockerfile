FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.9.1

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]