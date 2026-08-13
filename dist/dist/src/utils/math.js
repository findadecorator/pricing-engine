"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundCurrency = roundCurrency;
function roundCurrency(value) {
    return Number(value.toFixed(2));
}
