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
    // Vercel already routes /api/* to this function, so we need to strip /api prefix
    // for the Express app to handle routes correctly
    if (req.url.startsWith('/api')) {
      req.url = req.url.substring(4); // Remove '/api' prefix
    }
    if (req.url === '') {
      req.url = '/';
    }
    return app(req, res);
  } catch (err) {
    console.error('API handler error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};


