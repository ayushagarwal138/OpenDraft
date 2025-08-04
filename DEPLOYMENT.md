# OpenDraft Deployment Guide

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended - Full Stack)
Vercel supports both frontend and backend deployment in one platform.

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Set environment variables in Vercel dashboard

**Environment Variables for Vercel:**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://your-vercel-domain.vercel.app
NODE_ENV=production
```

### 2. Railway
Railway is great for full-stack applications with database support.

**Steps:**
1. Connect your GitHub repository to Railway
2. Railway will auto-detect the Node.js app
3. Set environment variables in Railway dashboard
4. Deploy automatically on push

### 3. Render
Render provides free hosting for full-stack applications.

**Steps:**
1. Connect your GitHub repository to Render
2. Choose "Web Service"
3. Set build command: `npm run install-all && npm run build`
4. Set start command: `cd server && npm start`
5. Configure environment variables

### 4. Heroku
Heroku is a classic choice for Node.js applications.

**Steps:**
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Set environment variables: `heroku config:set MONGODB_URI=your_connection_string`
4. Deploy: `git push heroku main`

## 📋 Pre-Deployment Checklist

### Environment Variables Setup

**Server (.env):**
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opendraft
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://yourdomain.com
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

**Client (.env):**
```env
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_NAME=OpenDraft
REACT_APP_DESCRIPTION=Professional Blog CMS
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_SOCIAL_SHARE_URL=https://yourdomain.com
GENERATE_SOURCEMAP=false
```

### Database Setup

1. **MongoDB Atlas (Recommended):**
   - Create free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Get connection string
   - Add IP whitelist (0.0.0.0/0 for all IPs)

2. **Local MongoDB:**
   - Install MongoDB locally
   - Create database: `opendraft`

### Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Set strong database password
- [ ] Configure CORS_ORIGIN to your domain
- [ ] Enable HTTPS in production
- [ ] Set up proper rate limiting
- [ ] Configure file upload limits

## 🔧 Build Commands

```bash
# Install all dependencies
npm run install-all

# Build for production
npm run build

# Start production server
npm start

# Development mode
npm run dev
```

## 📁 Project Structure for Deployment

```
OpenDraft/
├── client/                 # React frontend
│   ├── build/             # Production build (generated)
│   ├── public/            # Static files
│   └── src/               # Source code
├── server/                # Node.js backend
│   ├── controllers/       # API controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── server.js         # Main server file
├── package.json          # Root package.json
├── vercel.json          # Vercel configuration
└── DEPLOYMENT.md        # This file
```

## 🚨 Common Issues & Solutions

### 1. CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:** Set CORS_ORIGIN to your frontend domain

### 2. Database Connection Issues
**Problem:** Can't connect to MongoDB
**Solution:** Check MONGODB_URI and network access

### 3. Build Failures
**Problem:** Build process fails
**Solution:** Check Node.js version (>=16) and dependencies

### 4. Environment Variables Not Loading
**Problem:** Variables not available in app
**Solution:** Ensure proper naming (REACT_APP_ prefix for client)

## 📞 Support

For deployment issues:
1. Check the platform's documentation
2. Verify environment variables
3. Check build logs for errors
4. Ensure database connectivity

## 🎯 Recommended Deployment Flow

1. **Choose Platform:** Vercel (easiest) or Railway
2. **Setup Database:** MongoDB Atlas
3. **Configure Environment:** Set all required variables
4. **Deploy:** Push to main branch
5. **Test:** Verify all features work
6. **Monitor:** Check logs and performance

Happy Deploying! 🚀 