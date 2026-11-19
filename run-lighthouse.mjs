import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4173;
const TARGET_URL = `http://127.0.0.1:${PORT}`;

const checkServerReady = () => {
  return new Promise((resolve) => {
    const check = () => {
      const req = http.get(TARGET_URL, (res) => {
        if (res.statusCode === 200) resolve(true);
        else setTimeout(check, 500);
      });
      req.on('error', () => setTimeout(check, 500));
    };
    check();
  });
};

async function main() {
  console.log('🚀 Starting Vite preview server...');
  const frontendDir = path.join(__dirname, 'frontend');

  const reportDir = path.join(__dirname, 'lighthouse-report');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const vite = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], {
    cwd: frontendDir,
    shell: true,
  });

  await checkServerReady();
  console.log(`✅ Vite preview server is live on ${TARGET_URL}`);

  console.log('🔍 Executing Lighthouse CLI Audit...');
  const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  const outJson = path.join(reportDir, 'report.json');

  const args = [
    'lighthouse',
    TARGET_URL,
    '--chrome-flags="--headless=new --no-sandbox"',
    '--output=json',
    `--output-path="${outJson}"`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--quiet',
  ];

  const env = { ...process.env, CHROME_PATH: chromePath };
  const lighthouse = spawn('npx', args, { env, shell: true });

  lighthouse.stdout.on('data', (d) => console.log(`[Lighthouse] ${d.toString().trim()}`));
  lighthouse.stderr.on('data', (d) => console.error(`[Lighthouse Info] ${d.toString().trim()}`));

  lighthouse.on('close', (code) => {
    console.log(`Lighthouse exited with code: ${code}`);

    // Kill preview server
    vite.kill();

    if (fs.existsSync(outJson)) {
      const report = JSON.parse(fs.readFileSync(outJson, 'utf-8'));
      const categories = report.categories || {};
      const audits = report.audits || {};

      const summary = {
        auditUrl: TARGET_URL,
        timestamp: new Date().toISOString(),
        scores: {
          performance: Math.round((categories.performance?.score || 0) * 100),
          accessibility: Math.round((categories.accessibility?.score || 0) * 100),
          bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
          seo: Math.round((categories.seo?.score || 0) * 100),
        },
        metrics: {
          firstContentfulPaint: audits['first-contentful-paint']?.displayValue,
          largestContentfulPaint: audits['largest-contentful-paint']?.displayValue,
          totalBlockingTime: audits['total-blocking-time']?.displayValue,
          cumulativeLayoutShift: audits['cumulative-layout-shift']?.displayValue,
          speedIndex: audits['speed-index']?.displayValue,
        },
      };

      console.log('\n======================================================');
      console.log('🌟 ACTUAL LIGHTHOUSE AUDIT RESULTS:');
      console.log('======================================================');
      console.log(JSON.stringify(summary, null, 2));

      fs.writeFileSync(
        path.join(__dirname, 'lighthouse-summary.json'),
        JSON.stringify(summary, null, 2),
        'utf-8'
      );
    } else {
      console.log('Lighthouse json file not found at:', outJson);
    }

    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
