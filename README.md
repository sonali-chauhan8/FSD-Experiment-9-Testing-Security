# Student Management System - Full Stack Testing, Profiling & Security Hardening
### B.Tech V Semester — Full Stack Development Laboratory (Experiment No. 9)

An enterprise-hardened and systematically tested full-stack MERN (MongoDB, Express, React, Node.js) web application built to demonstrate industry-standard QA and cybersecurity engineering practices.

---

## 📁 Project Architecture & Directory Structure

```text
question9-fullstack-testing-security/
├── package.json                          # Unified root runner for full-stack commands
├── README.md                             # Step-by-step lab instructions & documentation
├── EXPERIMENT_9_REPORT.md                # Complete 10-section academic laboratory report
├── api-performance-profile.json          # Real measured API response time benchmark results
├── lighthouse-summary.json               # Real Google Lighthouse audit metrics & scores
├── run-lighthouse.mjs                    # Automated Lighthouse audit runner script
│
├── backend/                              # Hardened Express & MongoDB REST API
│   ├── .env                              # Development environment variables
│   ├── .env.test                         # Isolated test database environment variables
│   ├── .env.example                      # Safe template for environment configuration
│   ├── app.js                            # Express application setup with security middleware
│   ├── server.js                         # Server entry point & database connection bootstrap
│   ├── package.json                      # Backend dependencies (Jest, Supertest, Helmet, etc.)
│   ├── config/
│   │   └── db.js                         # MongoDB connection manager with error resilience
│   ├── controllers/
│   │   └── studentController.js          # REST API business logic for student records
│   ├── middleware/
│   │   ├── securityMiddleware.js         # Helmet, CORS origin control & rate limiters
│   │   ├── validationMiddleware.js       # Express-validator rules & HTML XSS sanitization
│   │   └── errorMiddleware.js            # Centralized 404 & error handler (masks stack in prod)
│   ├── models/
│   │   └── Student.js                    # Mongoose schema with field validation rules
│   ├── routes/
│   │   └── studentRoutes.js              # Protected REST routes with rate limiting & validation
│   ├── scripts/
│   │   └── profile-api.js                # High-precision API latency benchmark script
│   └── tests/
│       ├── student.test.js               # 19 Jest & Supertest endpoint CRUD integration tests
│       ├── security.test.js              # 8 Jest security tests (Helmet, rate limits, XSS)
│       └── exp8_legacy_verification.js   # Archived standalone verification script
│
├── frontend/                             # React + Vite Client Application
│   ├── .env                              # Frontend API base URL configuration
│   ├── .env.example                      # Template for frontend environment
│   ├── package.json                      # Frontend dependencies (Vitest, React Testing Library)
│   ├── vite.config.js                    # Vite configuration with Vitest jsdom integration
│   ├── tailwind.config.js                # Tailwind CSS styling configuration
│   ├── index.html                        # Application HTML root
│   ├── src/
│   │   ├── App.jsx                       # Client routing & layout structure
│   │   ├── main.jsx                      # React 18 DOM mount point
│   │   ├── components/                   # Modular UI components (Navbar, Tables, Modals)
│   │   ├── pages/                        # Views (Dashboard, StudentList, AddStudent, About)
│   │   ├── services/
│   │   │   └── api.js                    # Axios REST client with error interceptors
│   │   └── test/
│   │       ├── setup.js                  # Vitest environment setup (@testing-library/jest-dom)
│   │       ├── AddStudent.test.jsx       # 6 Vitest tests (rendering, validation, mock API)
│   │       └── StudentList.test.jsx      # 5 Vitest tests (table hydration, search, filters)
│   └── dist/                             # Optimized production build artifacts
│
└── postman/                              # Industry-Standard API Testing Suite
    ├── Student_Management_System_API_Collection.json   # 14 test requests with Postman assertions
    └── Student_Management_Environment.json             # Postman environment with variables
```

---

## ⚙️ Prerequisites

1. **Node.js**: `v18.0.0` or higher (verified on `v24.11.1`).
2. **MongoDB**: Local MongoDB community service running on port `27017` (or MongoDB Atlas connection string).
3. **VS Code**: Recommended editor for lab execution.

---

## 🚀 Quick Start Guide (Run Everything from Root)

Open this folder in VS Code (`question9-fullstack-testing-security`) and use the integrated terminal:

### 1. Run All Automated Tests (Backend + Frontend)
```bash
npm test
```
*Executes all 27 backend Jest tests against the isolated test database, followed by all 11 frontend Vitest tests.*

### 2. Run Backend Tests Only
```bash
npm run test:backend
```

### 3. Run Frontend Tests Only
```bash
npm run test:frontend
```

### 4. Run Real API Latency Benchmarking
```bash
npm run profile:api
```
*Measures min, median, mean, and P95 latency across CRUD endpoints against 180 actual requests.*

### 5. Build Frontend for Production
```bash
npm run build
```

---

## 💻 Running the Live Development Application

If you wish to view and interact with the student management web portal in your browser:

### Step 1: Start Backend Server
In Terminal 1:
```bash
cd backend
npm run dev
```
Server starts on: `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)

### Step 2: Start Frontend Application
In Terminal 2:
```bash
cd frontend
npm run dev
```
Client starts on: `http://localhost:5173`

---

## 🧪 Postman API Testing Instructions

1. Launch the **Postman** desktop application or web agent.
2. Click **Import** (top left).
3. Drag and drop both files from the `postman/` folder:
   - `postman/Student_Management_System_API_Collection.json`
   - `postman/Student_Management_Environment.json`
4. Select the environment **Experiment 9 Local Environment** in the top right environment dropdown.
5. Ensure the backend server is running (`cd backend && npm start`).
6. Click on the collection name and select **Run Collection**.
7. All 14 requests will execute sequentially and verify:
   - Status 200 / 201 for valid operations.
   - Status 400 for missing fields, bad emails, duplicate enrollment numbers.
   - Status 404 for deleted or non-existent IDs.
   - Presence of Helmet security headers (`X-Content-Type-Options: nosniff`).

---

## 🔒 Security Hardening Summary

1. **Helmet Protection**: Automatic response header hardening against Clickjacking (`SAMEORIGIN`), MIME-Sniffing (`nosniff`), and server fingerprint leakage (`X-Powered-By` hidden).
2. **Strict CORS**: Requests restricted to whitelisted origins specified in `CLIENT_URL` (`http://localhost:5173`).
3. **Express Rate Limiting**:
   - General API: Max 200 requests / 15 minutes per IP.
   - Data Mutations: Max 60 write requests / 15 minutes per IP.
4. **Input Sanitization**: HTML tag neutralization (`.escape()`) prevents Cross-Site Scripting (XSS).
5. **Centralized Error Handling**: Unified JSON error responses without leaking internal stack traces in production.
6. **Isolated Database Sandbox**: Destructive tests run strictly on `student_mgmt_exp9_isolated_test`, keeping your main student database safe.
