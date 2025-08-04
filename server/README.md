# OpenDraft Backend API

A comprehensive Blog/CMS backend built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based permissions
- **User Management**: Registration, login, profile management, role management
- **Blog Posts**: CRUD operations with draft/published status, categories, tags
- **Comments**: Nested comments with moderation system
- **Security**: Password hashing, input validation, rate limiting, CORS
- **File Uploads**: Image upload support for posts and avatars
- **Search & Filtering**: Advanced search and filtering capabilities
- **Pagination**: Efficient pagination for all list endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, express-rate-limit
- **File Upload**: multer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OpenDraft/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/opendraft
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   BCRYPT_ROUNDS=12
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |
| POST | `/api/auth/forgot-password` | Forgot password | Public |
| POST | `/api/auth/reset-password/:token` | Reset password | Public |

### Posts

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/posts` | Get all published posts | Public |
| GET | `/api/posts/:slug` | Get single post | Public |
| POST | `/api/posts` | Create new post | Private (Author/Admin) |
| PUT | `/api/posts/:id` | Update post | Private (Author/Admin) |
| DELETE | `/api/posts/:id` | Delete post | Private (Author/Admin) |
| POST | `/api/posts/:id/like` | Like post | Private |
| DELETE | `/api/posts/:id/like` | Unlike post | Private |
| GET | `/api/posts/me/posts` | Get user's posts | Private |
| GET | `/api/posts/author/:authorId` | Get posts by author | Public |

### Comments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/comments/post/:postId` | Get comments for post | Public |
| GET | `/api/comments/:id` | Get single comment | Private |
| POST | `/api/comments` | Create comment | Private |
| PUT | `/api/comments/:id` | Update comment | Private |
| DELETE | `/api/comments/:id` | Delete comment | Private |
| POST | `/api/comments/:id/like` | Like comment | Private |
| DELETE | `/api/comments/:id/like` | Unlike comment | Private |
| PUT | `/api/comments/:id/moderate` | Moderate comment | Private (Author/Admin) |

### Users (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Private (Admin) |
| GET | `/api/users/:id` | Get single user | Private |
| PUT | `/api/users/:id` | Update user | Private (Admin) |
| DELETE | `/api/users/:id` | Delete user | Private (Admin) |
| PUT | `/api/users/:id/role` | Update user role | Private (Admin) |

## User Roles

- **Reader**: Can read posts, like posts, comment on posts
- **Author**: Can create, edit, delete their own posts, moderate comments
- **Admin**: Full access to all features, user management

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Post
```bash
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "excerpt": "A brief summary of the post",
  "tags": ["blog", "first-post"],
  "category": "Technology",
  "status": "draft"
}
```

### Get Posts with Filtering
```bash
GET /api/posts?page=1&limit=10&category=Technology&search=javascript
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email",
      "value": "invalid-email"
    }
  ]
}
```

## Security Features

- **Password Hashing**: bcryptjs with configurable rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **SQL Injection Protection**: MongoDB with Mongoose ODM
- **XSS Protection**: Input sanitization and validation

## Database Models

### User Schema
- name, email, password (hashed)
- role (reader/author/admin)
- avatar, bio, verification status
- timestamps, last login

### Post Schema
- title, content, excerpt, slug
- author (ref to User), status (draft/published/archived)
- tags, category, featured image
- views, likes, read time
- SEO fields (title, description)

### Comment Schema
- content, author (ref to User), post (ref to Post)
- parent comment for nested replies
- status (pending/approved/rejected)
- likes, edit tracking

## Development

### Project Structure
```
server/
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── uploads/        # File uploads
├── server.js       # Main server file
├── package.json    # Dependencies
└── README.md       # This file
```

### Available Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (to be implemented)

## Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **Process Manager**: Use PM2 or similar for production
4. **Reverse Proxy**: Use Nginx or Apache
5. **SSL**: Configure HTTPS certificates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 