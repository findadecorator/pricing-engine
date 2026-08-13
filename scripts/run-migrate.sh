#!/bin/sh
set -e
npm ci --no-audit --no-fund
npx prisma generate
# auto-confirm prompt
printf "y\n" | npx prisma migrate dev --name init
