// Minimal event bus with in-memory fallback; Redis Streams adapter skeleton
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

export function publish(event: string, payload: any) {
  emitter.emit(event, payload);
}

export function subscribe(event: string, handler: (payload: any) => void) {
  emitter.on(event, handler);
}

export function clearHandlers() {
  emitter.removeAllListeners();
}
