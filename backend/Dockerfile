FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install  --legacy-peer-deps

COPY . .

RUN npm install -g @nestjs/cli

EXPOSE 3000

# RUN npm run build

# CMD ["npm", "run", "start:prod"]
CMD ["npm", "run", "start:dev"]