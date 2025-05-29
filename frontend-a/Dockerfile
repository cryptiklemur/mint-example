FROM node:slim

ARG ENV=prod
ENV ENV=$ENV

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN [ "$ENV" = "prod" ] && npm run build || echo "Skipping build for dev"

CMD [ "sh", "-c", "if [ \"$ENV\" = 'prod' ]; then npm start; else npm run dev; fi" ]