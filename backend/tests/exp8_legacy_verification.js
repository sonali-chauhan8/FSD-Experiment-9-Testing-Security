/**
 * Automated Verification Test Suite for Experiment No. 8
 * Tests all CRUD operations, schema validation, search & filtering against MongoDB
 */

const http = require('http');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const PORT = 5001; // Separate port for test server
const TEST_DB_PATH = path.join(__dirname, 'temp_mongo_data');

// Helper to make HTTP requests
const request = (method, endpoint, data = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:${PORT}${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 Starting Experiment No. 8 Full REST API & DB Tests');
  console.log('======================================================\n');

  let mongodProcess = null;

  // 1. Check or start mongod
  console.log('[Step 1] Preparing MongoDB database...');
  if (!fs.existsSync(TEST_DB_PATH)) {
    fs.mkdirSync(TEST_DB_PATH, { recursive: true });
  }

  const mongodExe = 'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe';
  if (fs.existsSync(mongodExe)) {
    console.log('[Step 1] Launching local mongod instance...');
    mongodProcess = spawn(mongodExe, [
      '--dbpath', TEST_DB_PATH,
      '--port', '27017',
      '--bind_ip', '127.0.0.1',
    ]);

    mongodProcess.stderr.on('data', (d) => {});
  }

  // Wait 2.5 seconds for mongod to initialize
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Connect Mongoose
  const testDbUri = 'mongodb://127.0.0.1:27017/student_mgmt_test_db';
  process.env.MONGODB_URI = testDbUri;
  process.env.PORT = String(PORT);

  try {
    await mongoose.connect(testDbUri, { serverSelectionTimeoutMS: 4000 });
    console.log('✅ [PASSED] Backend connects to MongoDB successfully.');
  } catch (err) {
    console.error('❌ [FAILED] Cannot connect to MongoDB:', err.message);
    if (mongodProcess) mongodProcess.kill();
    process.exit(1);
  }

  // Clear previous test collection
  const Student = require('../models/Student');
  await Student.deleteMany({});

  // 2. Start Express test server
  const express = require('express');
  const cors = require('cors');
  const studentRoutes = require('../routes/studentRoutes');

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/students', studentRoutes);
  app.get('/api/health', (req, res) => res.status(200).json({ status: 'healthy' }));

  const server = app.listen(PORT);
  console.log(`✅ [PASSED] Test Express server listening on port ${PORT}.\n`);

  let student1Id = null;
  let student2Id = null;

  try {
    // TEST 1: Health check
    const health = await request('GET', '/api/health');
    console.log(`1. GET /api/health -> Status: ${health.status} (${health.data.status})`);
    if (health.status !== 200) throw new Error('Health check failed');
    console.log('   ✅ Health check passed.');

    // TEST 2: POST /api/students (Create Student 1)
    const newStudent1 = {
      name: 'Aditya Sharma',
      enrollmentNumber: '0101CS221001',
      email: 'aditya.sharma@college.edu',
      branch: 'Computer Science & Engineering',
      semester: 5,
      mobileNumber: '9876543210',
    };
    const postRes1 = await request('POST', '/api/students', newStudent1);
    console.log(`2. POST /api/students -> Status: ${postRes1.status}, ID: ${postRes1.data.data?._id}`);
    if (postRes1.status !== 201 || !postRes1.data.data?._id) {
      throw new Error(`Failed to create student: ${JSON.stringify(postRes1.data)}`);
    }
    student1Id = postRes1.data.data._id;
    console.log('   ✅ [PASSED] POST API creates a student.');

    // TEST 3: POST /api/students (Duplicate Enrollment Check)
    const duplicateRes = await request('POST', '/api/students', newStudent1);
    console.log(`3. POST /api/students (Duplicate check) -> Status: ${duplicateRes.status}`);
    if (duplicateRes.status !== 400) {
      throw new Error('Duplicate enrollment number validation failed');
    }
    console.log('   ✅ [PASSED] Duplicate enrollment number prevented (HTTP 400).');

    // TEST 4: POST /api/students (Create Student 2)
    const newStudent2 = {
      name: 'Pooja Patel',
      enrollmentNumber: '0101IT221045',
      email: 'pooja.patel@college.edu',
      branch: 'Information Technology',
      semester: 5,
      mobileNumber: '9123456789',
    };
    const postRes2 = await request('POST', '/api/students', newStudent2);
    student2Id = postRes2.data.data?._id;
    console.log(`4. POST /api/students (Student 2) -> Status: ${postRes2.status}, ID: ${student2Id}`);

    // TEST 5: GET /api/students (Fetch All)
    const getAllRes = await request('GET', '/api/students');
    console.log(`5. GET /api/students -> Status: ${getAllRes.status}, Count: ${getAllRes.data.count}`);
    if (getAllRes.status !== 200 || getAllRes.data.count !== 2) {
      throw new Error(`Expected 2 students, got ${getAllRes.data.count}`);
    }
    console.log('   ✅ [PASSED] GET API returns student records.');

    // TEST 6: GET /api/students/:id (Fetch One)
    const getOneRes = await request('GET', `/api/students/${student1Id}`);
    console.log(`6. GET /api/students/:id -> Status: ${getOneRes.status}, Name: ${getOneRes.data.data?.name}`);
    if (getOneRes.status !== 200 || getOneRes.data.data?.name !== 'Aditya Sharma') {
      throw new Error('Failed to retrieve specific student by ID');
    }
    console.log('   ✅ [PASSED] GET single student by ID works.');

    // TEST 7: Search by Name/Enrollment
    const searchRes = await request('GET', '/api/students?search=Aditya');
    console.log(`7. GET /api/students?search=Aditya -> Found: ${searchRes.data.count}`);
    if (searchRes.data.count !== 1 || searchRes.data.data[0].enrollmentNumber !== '0101CS221001') {
      throw new Error('Search filtering failed');
    }
    console.log('   ✅ [PASSED] Search filtering works.');

    // TEST 8: Filter by Branch
    const branchRes = await request('GET', '/api/students?branch=Information%20Technology');
    console.log(`8. GET /api/students?branch=IT -> Found: ${branchRes.data.count}`);
    if (branchRes.data.count !== 1 || branchRes.data.data[0].name !== 'Pooja Patel') {
      throw new Error('Branch filtering failed');
    }
    console.log('   ✅ [PASSED] Branch filtering works.');

    // TEST 9: GET /api/students/stats (Dashboard Analytics)
    const statsRes = await request('GET', '/api/students/stats');
    console.log(`9. GET /api/students/stats -> Total: ${statsRes.data.data?.totalStudents}`);
    if (statsRes.status !== 200 || statsRes.data.data?.totalStudents !== 2) {
      throw new Error('Dashboard statistics computation failed');
    }
    console.log('   ✅ [PASSED] Dashboard stats endpoint works.');

    // TEST 10: PUT /api/students/:id (Update Student)
    const updatePayload = {
      name: 'Aditya Sharma (Updated)',
      mobileNumber: '9988776655',
    };
    const putRes = await request('PUT', `/api/students/${student1Id}`, updatePayload);
    console.log(`10. PUT /api/students/:id -> Status: ${putRes.status}, Updated Name: ${putRes.data.data?.name}`);
    if (putRes.status !== 200 || putRes.data.data?.name !== 'Aditya Sharma (Updated)') {
      throw new Error('Update student details failed');
    }
    console.log('   ✅ [PASSED] PUT API updates student details.');

    // TEST 11: DELETE /api/students/:id (Delete Student 2)
    const deleteRes = await request('DELETE', `/api/students/${student2Id}`);
    console.log(`11. DELETE /api/students/:id -> Status: ${deleteRes.status}`);
    if (deleteRes.status !== 200) {
      throw new Error('Delete student failed');
    }
    console.log('   ✅ [PASSED] DELETE API removes a student.');

    // TEST 12: Verify Database Persistence & Remaining Records
    const verifyAllRes = await request('GET', '/api/students');
    console.log(`12. Verifying persistence -> Remaining count: ${verifyAllRes.data.count}`);
    if (verifyAllRes.data.count !== 1 || verifyAllRes.data.data[0]._id !== student1Id) {
      throw new Error('Persistence verification failed');
    }
    console.log('   ✅ [PASSED] Data remains stored and persistent in MongoDB.');

    console.log('\n======================================================');
    console.log('🎉 ALL 12 BACKEND & DATABASE TESTS PASSED SUCCESSFULLY!');
    console.log('======================================================\n');
  } finally {
    // Teardown
    server.close();
    await mongoose.connection.close();
    if (mongodProcess) {
      mongodProcess.kill();
    }
  }
}

runTestSuite().catch((err) => {
  console.error('\n❌ Test execution failed with error:', err.message);
  process.exit(1);
});
