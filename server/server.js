'use strict';

require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  // Try to get a DB connection — if it fails, log clearly and exit
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected — host:', process.env.DB_HOST, 'port:', process.env.DB_PORT, 'db:', process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection FAILED:', err.message);
    console.error('');
    console.error('Your current .env settings:');
    console.error('  DB_HOST    =', process.env.DB_HOST);
    console.error('  DB_PORT    =', process.env.DB_PORT);
    console.error('  DB_USER    =', process.env.DB_USER);
    console.error('  DB_PASSWORD=', process.env.DB_PASSWORD ? '(set)' : '(EMPTY — this is likely the problem)');
    console.error('  DB_NAME    =', process.env.DB_NAME);
    console.error('');
    console.error('Fix checklist:');
    console.error('  1. Is MAMP running? Both Apache + MySQL must be GREEN');
    console.error('  2. Open MAMP > Preferences > Ports — what is the MySQL port? (3306 or 8889)');
    console.error('  3. Update DB_PORT in server/.env to match');
    console.error('  4. MAMP default password is "root" — confirm in server/.env');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`   API ready at http://localhost:${PORT}/api`);
  });
}

startServer();
