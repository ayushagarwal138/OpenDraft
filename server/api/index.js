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
    // Ensure the internal Express app sees the classic '/api/*' paths
    if (!req.url.startsWith('/api')) {
      req.url = `/api${req.url}`;
    }
    return app(req, res);
  } catch (err) {
    console.error('API handler error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};


