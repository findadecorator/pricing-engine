const { exec } = require('child_process');

const path = require('path');
const root = path.resolve(__dirname, '..', '..');
function run(cmd) {
  return new Promise((res)=> {
    exec(cmd, {cwd: root, env: process.env}, (err, stdout, stderr) => {
      console.log(cmd);
      console.log(stdout);
      if (err) console.error(stderr);
      res({ err, stdout, stderr });
    });
  });
}

(async ()=>{
  await run('node scripts/smoke-tests/pricing-smoke.js');
  await run('node scripts/smoke-tests/messaging-smoke.js');
  await run('node scripts/smoke-tests/ads-smoke.js');
  console.log('full smoke done');
})();
