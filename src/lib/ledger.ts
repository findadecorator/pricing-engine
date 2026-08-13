import { writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

const LOG = join(__dirname, '..', '..', 'ledger.log');

export function recordLedger(event: any) {
  // append-only JSON lines
  const line = JSON.stringify({ ts: new Date().toISOString(), ...event }) + '\n';
  try {
    appendFileSync(LOG, line, { encoding: 'utf8' });
  } catch (err) {
    // fallback: write once
    writeFileSync(LOG, line, { encoding: 'utf8' });
  }
}
