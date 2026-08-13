import { seedDemoUser } from '../src/services/creditService';

async function main() {
  const seed = await seedDemoUser();
  if (seed) {
    console.log(`Seeded demo user ${seed.id} (${seed.email}).`);
  } else {
    console.log('Seed fallback did not create a user.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
