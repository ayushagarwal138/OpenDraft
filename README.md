# OpenDraft - Blog/CMS Platform

A full-stack blog and content management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

![OpenDraft](https://img.shields.io/badge/OpenDraft-Blog%20CMS-blue)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-orange)

## 🚀 Features

### Core Features
- **User Authentication & Authorization**: JWT-based authentication with role-based permissions
- **Blog Post Management**: Create, edit, delete, and publish blog posts
- **Rich Text Editor**: WYSIWYG editor with formatting options
- **Comment System**: Nested comments with moderation capabilities
- **User Profiles**: Customizable user profiles with avatars and bios
- **Search & Filtering**: Advanced search and category/tag filtering
- **Responsive Design**: Mobile-first responsive design with Material-UI

### User Roles
- **Reader**: Read posts, like posts, comment on posts
- **Author**: Create, edit, delete their own posts, moderate comments
- **Admin**: Full access to all features, user management

### Technical Features
- **Security**: Password hashing, input validation, rate limiting, CORS
- **Performance**: Pagination, efficient database queries, optimized images
- **SEO**: Meta tags, structured data, clean URLs with slugs
- **Real-time**: Like/unlike posts, comment interactions
- **File Upload**: Image upload support for posts and avatars

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, express-rate-limit
- **File Upload**: multer

### Frontend
- **Framework**: React.js 19
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Yup validation
- **Rich Text Editor**: React Quill
- **HTTP Client**: Axios

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd OpenDraft
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Environment Configuration

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/opendraft
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

## 📁 Project Structure

```
OpenDraft/
├── server/                 # Backend API
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   └── package.json       # Frontend dependencies
└── README.md             # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create new post (Author/Admin)
- `PUT /api/posts/:id` - Update post (Author/Admin)
- `DELETE /api/posts/:id` - Delete post (Author/Admin)
- `POST /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id/like` - Unlike post

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `PUT /api/comments/:id/moderate` - Moderate comment (Author/Admin)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/role` - Update user role

## 🎯 Usage Guide

### For Readers
1. **Browse Posts**: Visit the home page to see all published posts
2. **Search & Filter**: Use the search bar and category filters
3. **Read Posts**: Click on any post to read the full content
4. **Interact**: Like posts and leave comments (requires registration)
5. **Create Account**: Register to unlock full features

### For Authors
1. **Dashboard**: Access your dashboard to manage posts
2. **Create Posts**: Use the rich text editor to create engaging content
3. **Manage Posts**: Edit, delete, or change status of your posts
4. **Moderate Comments**: Approve or reject comments on your posts
5. **Analytics**: View post views and engagement metrics

### For Admins
1. **User Management**: Manage all users and their roles
2. **Content Moderation**: Moderate all posts and comments
3. **System Overview**: Access comprehensive analytics
4. **Settings**: Configure system-wide settings

## 🔒 Security Features

- **Password Security**: bcrypt hashing with configurable rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **SQL Injection Protection**: MongoDB with Mongoose ODM
- **XSS Protection**: Input sanitization and validation

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Set Environment Variables**:
   ```env
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-production-jwt-secret
   CORS_ORIGIN=your-frontend-url
   ```

2. **Deploy**:
   ```bash
   cd server
   npm start
   ```

### Frontend Deployment (Netlify/Vercel)

1. **Build the app**:
   ```bash
   cd client
   npm run build
   ```

2. **Set Environment Variables**:
   ```env
   REACT_APP_API_URL=your-backend-url
   ```

3. **Deploy the `build` folder**

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful UI components
- [React Quill](https://quilljs.com/) for the rich text editor
- [MongoDB](https://www.mongodb.com/) for the database
- [Express.js](https://expressjs.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend framework

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/opendraft/issues) page
2. Create a new issue with a detailed description
3. Contact the maintainers

---

**Happy Blogging! 🚀** # OpenDraft
