const dotenv = require('dotenv');
const path = require('path');

// Determine env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

let server = null;

// Only start the server if this file is run directly (not required as a test module)
if (require.main === module || process.env.NODE_ENV !== 'test') {
  // Connect to Database
  connectDB();

  server = app.listen(PORT, () => {
    console.log(`
====================================================================
  🛡️  Hardened Student Management API Server Running
  📡 Local URL:       http://localhost:${PORT}
  🔗 API Base:        http://localhost:${PORT}/api/students
  🩺 Health Check:    http://localhost:${PORT}/api/health
  🌍 Allowed Client:  ${CLIENT_URL}
  🔒 Security:        Helmet, RateLimit, Input Sanitization Active
  ⚙️  Environment:     ${process.env.NODE_ENV || 'development'}
====================================================================
    `);
  });
}

module.exports = { app, server };
