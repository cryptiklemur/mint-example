FROM node:slim

ARG ENV=prod
ENV ENV=$ENV

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "sh", "-c", "if [ \"$ENV\" = 'prod' ]; then npm start; else npm run dev; fi" ]