# pricing-engine

A lightweight pricing service with Prisma persistence and a simple credit purchasing API.

## Scripts

- `npm install`
- `npx prisma generate`
- `npx prisma migrate dev --name init`
- `npm run seed`
- `npm run dev`

## API

- `GET /api/pricing/info`
- `POST /api/pricing/buy-pack`
