const http = require('http');

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:4000${path}`, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

(async () => {
  const body = await request('/api/dashboard/customer');
  console.log(body);
})();
