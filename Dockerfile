FROM node:20-alpine3.17

COPY . .
RUN npm ci

# RUN npm install -g pm2

EXPOSE 8080

CMD ["node", "src/index.js"]