"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = publish;
exports.subscribe = subscribe;
exports.clearHandlers = clearHandlers;
// Minimal event bus with in-memory fallback; Redis Streams adapter skeleton
const events_1 = require("events");
const emitter = new events_1.EventEmitter();
function publish(event, payload) {
    emitter.emit(event, payload);
}
function subscribe(event, handler) {
    emitter.on(event, handler);
}
function clearHandlers() {
    emitter.removeAllListeners();
}
