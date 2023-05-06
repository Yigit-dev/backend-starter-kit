FROM node:20-alpine3.16
WORKDIR /usr/src/app
COPY package*.json .

RUN npm ci
RUN npm install -g nodemon
COPY . .
EXPOSE 3000

CMD ["npm", "run", "dev"]
