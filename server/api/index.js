const mongoose = require('mongoose');
const app = require('../app');

let isConnected = false;

async function ensureDbConnection() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  isConnected = !!conn.connection.readyState;
}

module.exports = async (req, res) => {
  try {
    await ensureDbConnection();
    // Vercel routes /api/* to this function, but Express app expects /api/* routes
    // So we keep the full path including /api prefix
    return app(req, res);
  } catch (err) {
    console.error('API handler error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};


