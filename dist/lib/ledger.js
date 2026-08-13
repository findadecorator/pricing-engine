"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordLedger = recordLedger;
const fs_1 = require("fs");
const path_1 = require("path");
const LOG = (0, path_1.join)(__dirname, '..', '..', 'ledger.log');
function recordLedger(event) {
    // append-only JSON lines
    const line = JSON.stringify({ ts: new Date().toISOString(), ...event }) + '\n';
    try {
        (0, fs_1.appendFileSync)(LOG, line, { encoding: 'utf8' });
    }
    catch (err) {
        // fallback: write once
        (0, fs_1.writeFileSync)(LOG, line, { encoding: 'utf8' });
    }
}
