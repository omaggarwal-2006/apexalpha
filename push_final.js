const fs = require('fs');
const https = require('https');

const REPO = 'omaggarwal-2006/apexalpha';
const BRANCH = 'main';
const TOKEN = process.env.GITHUB_TOKEN;

function githubAPI(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}${path}`,
      method,
      headers: {
        'Authorization': `token ${TOKEN}`,
        'User-Agent': 'apexalpha-push',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch(e) { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function updateFile(filePath, localPath, message) {
  const existing = await githubAPI('GET', `/contents/${filePath}?ref=${BRANCH}`);
  const sha = existing.data?.sha;
  const content = fs.readFileSync(localPath, 'utf8');
  const base64 = Buffer.from(content).toString('base64');
  const result = await githubAPI('PUT', `/contents/${filePath}`, {
    message, content: base64, sha, branch: BRANCH,
  });
  if (result.status === 200 || result.status === 201) {
    console.log('OK: ' + filePath);
  } else {
    console.log('FAIL: ' + filePath + ' - ' + result.status + ' - ' + JSON.stringify(result.data?.message));
  }
}

async function main() {
  console.log('Pushing fixes to GitHub...\n');

  await updateFile(
    'app/sitemap.js',
    'C:/Users/user/.gemini/antigravity/scratch/apexalpha/app/sitemap.js',
    'fix: update dynamic sitemap - use apexalpha.fun domain and correct blog slugs'
  );

  await updateFile(
    'app/layout.js',
    'C:/Users/user/.gemini/antigravity/scratch/apexalpha/app/layout.js',
    'fix: update metadataBase and OG URL from www.apexalpha.fun to apexalpha.fun'
  );

  console.log('\nDone!');
}
main().catch(console.error);
