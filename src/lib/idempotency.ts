import { PrismaClient } from '@prisma/client';

// Simple idempotency store with in-memory fallback
const store = new Map<string, any>();

export async function getIdempotentResult(key: string) {
  return store.get(key);
}

export async function setIdempotentResult(key: string, value: any, ttlSeconds = 3600) {
  store.set(key, value);
  setTimeout(() => store.delete(key), ttlSeconds * 1000);
}

export function idempotencyMiddleware(req: any, res: any, next: any) {
  const key = req.headers['idempotency-key'] || req.headers['Idempotency-Key'];
  if (!key) return next();
  const existing = store.get(key);
  if (existing) {
    res.setHeader('Idempotency-Key', key);
    return res.json(existing);
  }
  // attach a finish handler to persist response
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    store.set(key, body);
    setTimeout(() => store.delete(key), 3600 * 1000);
    return originalJson(body);
  };
  next();
}
