FROM node:16-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install express mysql2 path cors
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]