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
    console.log('Health');
    console.log(await request('/health'));
    console.log(await request('/api/pricing/info'));
    // Use seeded demo user id created by the seed script
    const seededUserId = 'cmsnxwwin0000h8ovecamsud2';
    console.log(await request('/api/pricing/buy-pack','POST',{ userId: seededUserId, packName: 'Small Pack' }));
    // Unlock endpoint is served at /api/leads/unlock in the running server
    console.log(await request('/api/leads/unlock','POST',{ userId: seededUserId, jobSize: 10 }));
  } catch(e){ console.error(e); process.exit(1); }
})();
