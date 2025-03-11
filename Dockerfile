FROM node:23.7.0

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci

COPY . /app

RUN npx next build

EXPOSE 3000

CMD ["npx", "next", "start"]