FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Pastikan PORT di .env backend adalah 5000
EXPOSE 5000
CMD ["node", "index.js"]