/*
  Reset and seed database
  - Drops Users, Posts, Comments, Reports, Notifications collections
  - Creates a fresh Admin user with provided credentials
  Usage:
    ADMIN_NAME="Site Admin" ADMIN_EMAIL="admin@opendraft.local" ADMIN_PASSWORD="Admin@12345" node scripts/resetAndSeed.js
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: process.env.ENV_FILE || '.env' });

const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
let Notification;
let Report;
try {
  Notification = require('../models/Notification');
} catch {}
try {
  Report = require('../models/Report');
} catch {}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment. Aborting.');
  process.exit(1);
}

const adminName = process.env.ADMIN_NAME || 'Site Admin';
// Use a valid email per User model regex (requires dot + 2-3 char TLD)
const adminEmail = process.env.ADMIN_EMAIL || 'admin@opendraft.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Drop targeted collections if they exist
  const collections = await mongoose.connection.db.listCollections().toArray();
  const names = new Set(collections.map(c => c.name));

  const maybeDrop = async (name) => {
    if (names.has(name)) {
      await mongoose.connection.db.dropCollection(name);
      console.log(`Dropped collection: ${name}`);
    }
  };

  await maybeDrop('users');
  await maybeDrop('posts');
  await maybeDrop('comments');
  if (names.has('notifications')) await maybeDrop('notifications');
  if (names.has('reports')) await maybeDrop('reports');

  // Recreate admin user
  const admin = await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });

  console.log('Created admin user:', { id: admin._id.toString(), email: admin.email, role: admin.role });
  console.log('Done.');
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Seed error:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


