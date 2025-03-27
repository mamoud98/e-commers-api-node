FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@11.2.0

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]