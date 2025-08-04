#!/bin/bash

echo "🚀 OpenDraft Deployment Script"
echo "=============================="
echo "This script helps you deploy OpenDraft to Vercel (frontend) + Render (backend)"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build the project
echo "🔨 Building for production..."
npm run build

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. 🗄️  Setup MongoDB Atlas:"
echo "   - Go to https://www.mongodb.com/atlas"
echo "   - Create a free cluster"
echo "   - Get your connection string"
echo ""
echo "2. 🔧 Deploy Backend on Render:"
echo "   - Go to https://dashboard.render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Set build command: cd server && npm install"
echo "   - Set start command: cd server && npm start"
echo "   - Add environment variables (see DEPLOYMENT.md)"
echo ""
echo "3. 🎨 Deploy Frontend on Vercel:"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Create new project"
echo "   - Import your GitHub repo"
echo "   - Set root directory to 'client'"
echo "   - Add environment variables (see DEPLOYMENT.md)"
echo ""
echo "4. 🔗 Update CORS:"
echo "   - Update CORS_ORIGIN in Render with your Vercel URL"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "Happy Deploying! 🚀" 