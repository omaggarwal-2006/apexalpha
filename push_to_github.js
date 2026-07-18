const fs = require('fs');
const https = require('https');

const REPO = 'omaggarwal-2006/apexalpha';
const BRANCH = 'main';
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error('ERROR: Set GITHUB_TOKEN environment variable first!');
  console.log('Run: $env:GITHUB_TOKEN = "your_github_personal_access_token"');
  process.exit(1);
}

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
  // Get current file SHA
  const existing = await githubAPI('GET', `/contents/${filePath}?ref=${BRANCH}`);
  const sha = existing.data?.sha;
  
  const content = fs.readFileSync(localPath, 'utf8');
  const base64 = Buffer.from(content).toString('base64');
  
  const result = await githubAPI('PUT', `/contents/${filePath}`, {
    message,
    content: base64,
    sha,
    branch: BRANCH,
  });
  
  if (result.status === 200 || result.status === 201) {
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`❌ Failed: ${filePath} - ${result.status} - ${JSON.stringify(result.data?.message || result.data)}`);
  }
}

async function main() {
  console.log('Pushing changes to GitHub...\n');
  
  // 1. Update next.config.mjs (removed www redirect)
  await updateFile(
    'next.config.mjs',
    'C:/Users/user/.gemini/antigravity/scratch/apexalpha/next.config.mjs',
    'fix: remove apexalpha.fun → www redirect that blocked AdSense ads.txt crawler'
  );
  
  // 2. Update app/layout.js (removed overflow-hidden for scroll fix)
  await updateFile(
    'app/layout.js',
    'C:/Users/user/.gemini/antigravity/scratch/apexalpha/app/layout.js',
    'fix: remove overflow-hidden from body to allow blog page scrolling'
  );
  
  console.log('\nDone!');
}

main().catch(console.error);
