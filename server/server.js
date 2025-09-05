const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const Post = require('./models/Post');
const app = require('./app');

// Load environment variables
dotenv.config();

// App and routes are configured in ./app for reuse across environments

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();

// Scheduled publishing job: runs every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const postsToPublish = await Post.find({
      status: 'draft',
      scheduledDate: { $lte: now, $ne: null }
    });
    for (const post of postsToPublish) {
      post.status = 'published';
      post.publishedAt = now;
      await post.save();
      console.log(`Published scheduled post: ${post.title} (${post._id})`);
    }
  } catch (err) {
    console.error('Error in scheduled publishing job:', err);
  }
});

module.exports = app; 