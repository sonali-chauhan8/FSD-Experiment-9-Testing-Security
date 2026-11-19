const http = require('http');
const { performance } = require('perf_hooks');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = require('../app');
const Student = require('../models/Student');
const { connectDB, disconnectDB } = require('../config/db');

const TEST_PORT = 5003;
const ISOLATED_TEST_DB = 'mongodb://127.0.0.1:27017/student_mgmt_exp9_profile_db';

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        const duration = performance.now() - start;
        resolve({
          statusCode: res.statusCode,
          durationMs: duration,
          bytes: Buffer.byteLength(body),
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const calculateMetrics = (samples) => {
  const durations = samples.map((s) => s.durationMs).sort((a, b) => a - b);
  const total = durations.reduce((acc, v) => acc + v, 0);
  const min = durations[0];
  const max = durations[durations.length - 1];
  const mean = total / durations.length;
  const median = durations[Math.floor(durations.length / 2)];
  const p95 = durations[Math.floor(durations.length * 0.95)];

  return {
    samples: durations.length,
    minMs: Number(min.toFixed(2)),
    maxMs: Number(max.toFixed(2)),
    meanMs: Number(mean.toFixed(2)),
    medianMs: Number(median.toFixed(2)),
    p95Ms: Number(p95.toFixed(2)),
  };
};

async function runApiProfiling() {
  console.log('\n======================================================');
  console.log('⚡ Starting Real API Performance Profiling Benchmark');
  console.log('======================================================\n');

  process.env.NODE_ENV = 'test';
  await connectDB(ISOLATED_TEST_DB);

  // Seed sample data for realistic retrieval
  await Student.deleteMany({});
  const seedRecords = [];
  for (let i = 1; i <= 25; i++) {
    seedRecords.push({
      name: `Benchmark Student ${i}`,
      enrollmentNumber: `0101CS22${1000 + i}`,
      email: `benchmark.student${i}@college.edu`,
      branch: i % 2 === 0 ? 'Computer Science & Engineering' : 'Information Technology',
      semester: (i % 8) + 1,
      mobileNumber: `98${String(10000000 + i).slice(0, 8)}`,
    });
  }
  await Student.insertMany(seedRecords);
  console.log(`[Setup] Seeded 25 student records into isolated benchmark database.`);

  const server = app.listen(TEST_PORT);
  console.log(`[Setup] Test Express instance running on http://127.0.0.1:${TEST_PORT}\n`);

  // Warmup 5 requests
  for (let i = 0; i < 5; i++) {
    await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/health',
      method: 'GET',
    });
  }

  const results = {};

  // 1. Profile GET /api/health (50 samples)
  console.log('Testing GET /api/health (50 requests)...');
  const healthSamples = [];
  for (let i = 0; i < 50; i++) {
    const res = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/health',
      method: 'GET',
    });
    healthSamples.push(res);
  }
  results['GET /api/health'] = calculateMetrics(healthSamples);

  // 2. Profile GET /api/students (50 samples)
  console.log('Testing GET /api/students (50 requests)...');
  const getStudentsSamples = [];
  for (let i = 0; i < 50; i++) {
    const res = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/students',
      method: 'GET',
    });
    getStudentsSamples.push(res);
  }
  results['GET /api/students'] = calculateMetrics(getStudentsSamples);

  // 3. Profile GET /api/students/stats (50 samples)
  console.log('Testing GET /api/students/stats (50 requests)...');
  const statsSamples = [];
  for (let i = 0; i < 50; i++) {
    const res = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/students/stats',
      method: 'GET',
    });
    statsSamples.push(res);
  }
  results['GET /api/students/stats'] = calculateMetrics(statsSamples);

  // 4. Profile POST /api/students (30 write samples)
  console.log('Testing POST /api/students (30 write requests)...');
  const postSamples = [];
  for (let i = 0; i < 30; i++) {
    const postData = {
      name: `Profiling User ${i}`,
      enrollmentNumber: `0101PF22${5000 + i}`,
      email: `perf.user${i}@college.edu`,
      branch: 'Computer Science & Engineering',
      semester: 5,
      mobileNumber: '9876543210',
    };
    const res = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/api/students',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      postData
    );
    postSamples.push(res);
  }
  results['POST /api/students'] = calculateMetrics(postSamples);

  // Clean up
  server.close();
  await Student.deleteMany({});
  await disconnectDB();

  console.log('\n======================================================');
  console.log('📊 Actual API Response Time Benchmark Results:');
  console.log('======================================================');
  console.table(results);

  // Save report to file
  const reportPath = path.join(__dirname, '..', '..', 'api-performance-profile.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n✅ Saved benchmark metrics to: ${reportPath}`);
}

runApiProfiling().catch((err) => {
  console.error('Benchmark execution error:', err);
  process.exit(1);
});
