FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]
