FROM node:10-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
COPY package-lock.json  /app/
COPY babel.config.json  /app/
COPY nodemon.json  /app/

COPY . /app/

RUN npm install

ENTRYPOINT ["npm", "run"]

CMD ["dev"]