"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const creditService_1 = require("../services/creditService");
async function main() {
    const seed = await (0, creditService_1.seedDemoUser)();
    if (seed) {
        console.log(`Seeded demo user ${seed.id} (${seed.email}).`);
    }
    else {
        console.log('Seed fallback did not create a user.');
    }
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
