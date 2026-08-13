const http = require('http');

function request(path, method='GET', body) {
  return new Promise((resolve, reject) => {
    const options = { hostname: 'localhost', port: 4000, path, method, headers: { 'Content-Type': 'application/json' } };
    const req = http.request(options, (res) => {
      let data=''; res.on('data', (c)=>data+=c); res.on('end',()=>resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async ()=>{
  try {
    const resp = await request('/api/campaigns','POST',{ name: 'Smoke', ownerId: 'seed-user', budgetPence: 100000, startDate: new Date().toISOString() });
    console.log('campaign created', resp.body);
  } catch(e){ console.error(e); process.exit(1); }
})();
