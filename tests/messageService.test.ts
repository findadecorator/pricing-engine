import { postMessage } from '../src/services/messageService';

test('postMessage idempotency', async () => {
  const conv = await postMessage({ conversationId: 'test-conv', senderId: 'u1', body: 'hello', idempotencyKey: 'key1' });
  const conv2 = await postMessage({ conversationId: 'test-conv', senderId: 'u1', body: 'hello', idempotencyKey: 'key1' });
  expect(conv.id).toBe(conv2.id);
});
