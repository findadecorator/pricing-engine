const { Client } = require('pg');
(async ()=> {
  const c = new Client({ connectionString: 'postgresql://postgres:postgres@127.0.0.1:5432/pricing' });
  try {
    await c.connect();
    console.log('CONNECTED');
    const r = await c.query('SELECT current_database() as db, current_user as user');
    console.log(r.rows);
    await c.end();
  } catch (e) {
    console.error('ERR:', e.message);
    process.exit(1);
  }
})();
