const express = require('express');
const { body, query } = require('express-validator');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getMyPosts,
  getPostsByAuthor,
  addReactionToPost,
  removeReactionFromPost,
  getPostAnalytics
} = require('../controllers/postController');

const router = express.Router();

// Validation rules
const createPostValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Excerpt cannot be more than 300 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot be more than 50 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived')
];

const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Excerpt cannot be more than 300 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot be more than 50 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category filter cannot be more than 50 characters'),
  query('tag')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Tag filter cannot be more than 50 characters'),
  query('author')
    .optional()
    .isMongoId()
    .withMessage('Author must be a valid MongoDB ID')
];

// Public routes
router.get('/', queryValidation, handleValidationErrors, optionalAuth, getPosts);
// Place more specific/static routes BEFORE dynamic slug to avoid collisions
router.get('/author/:authorId', queryValidation, handleValidationErrors, getPostsByAuthor);

// Protected routes (require authentication)
router.use(protect);

// Author/Admin only routes (temporarily allowing all authenticated users)
router.post('/', protect, createPostValidation, handleValidationErrors, createPost);
router.put('/:id', authorize('author', 'admin'), updatePostValidation, handleValidationErrors, updatePost);
router.delete('/:id', authorize('author', 'admin'), deletePost);
router.get('/me/posts', getMyPosts);

// Admin only routes (place before slug route to avoid catching 'all' as slug)
router.get('/all', authorize('admin'), queryValidation, handleValidationErrors, getPosts);

// Like/Unlike routes
router.post('/:id/like', likePost);
router.delete('/:id/like', unlikePost);

// Reaction routes
router.post('/:id/reaction', addReactionToPost);
router.delete('/:id/reaction', removeReactionFromPost);

router.get('/:id/analytics', protect, getPostAnalytics);

// Dynamic slug route should be last
router.get('/:slug', optionalAuth, getPost);

module.exports = router; 