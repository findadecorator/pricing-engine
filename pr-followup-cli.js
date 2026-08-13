const https = require('https');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'node-pr-followup',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`GitHub API error ${res.statusCode}: ${data}`));
          return;
        }
        resolve(data ? JSON.parse(data) : {});
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  const { GITHUB_TOKEN, OWNER, REPO, PR_NUMBER, LABELS } = process.env;
  if (!GITHUB_TOKEN || !OWNER || !REPO || !PR_NUMBER || !LABELS) {
    throw new Error('Missing required env vars: GITHUB_TOKEN, OWNER, REPO, PR_NUMBER, LABELS');
  }

  const labels = LABELS.split(',').map((label) => label.trim()).filter(Boolean);
  const path = `/repos/${OWNER}/${REPO}/issues/${PR_NUMBER}/labels`;
  const result = await request('POST', path, labels);
  console.log(JSON.stringify(result, null, 2));

  const commentBody = `Validation summary

- Local validation: npm run build:dashboard succeeded
- npm run build succeeded
- Node smoke tests passed for GET /api/dashboard/pro, GET /api/dashboard/customer, GET /api/dashboard/realtime

Acceptance criteria for merge:
- CI green for build:dashboard and smoke tests
- 2 approvals (dev lead + QA)

Post-merge: run migrations in staging, deploy to staging, run full E2E smoke tests, then schedule production deploy and tag release.`;

  const commentResult = await request('POST', `/repos/${OWNER}/${REPO}/issues/${PR_NUMBER}/comments`, { body: commentBody });
  console.log(JSON.stringify(commentResult, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
