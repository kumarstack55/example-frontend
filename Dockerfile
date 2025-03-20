FROM node:23.7.0

ENV APP_HOME="/app"

WORKDIR ${APP_HOME}

COPY package*.json ${APP_HOME}/

RUN npm ci

COPY . ${APP_HOME}/

RUN npx next build

EXPOSE 3000

CMD ["npx", "next", "start"]