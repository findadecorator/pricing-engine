const http = require('http');
const assert = require('assert');

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
    console.log('Creating conversation...');
    const conv = await request('/api/messages/conversations','POST',{ title: 'Smoke', createdBy: 'seed-user', participants: ['seed-user'] });
    console.log(conv.body);
    console.log('Messaging smoke done');
  } catch(e){ console.error(e); process.exit(1); }
})();
