const express = require('express');
const { body, query } = require('express-validator');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const {
  getComments,
  getAllComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  moderateComment,
  addReactionToComment,
  removeReactionFromComment
} = require('../controllers/commentController');

const router = express.Router();

// Validation rules
const createCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  body('post')
    .isMongoId()
    .withMessage('Post must be a valid MongoDB ID'),
  body('parentComment')
    .optional()
    .isMongoId()
    .withMessage('Parent comment must be a valid MongoDB ID')
];

const updateCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
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
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Status must be pending, approved, or rejected')
];

// Public routes
router.get('/post/:postId', queryValidation, handleValidationErrors, optionalAuth, getComments);

// Protected routes (require authentication)
router.use(protect);

// Admin only routes (place BEFORE dynamic :id to avoid '/all' matching ':id')
router.get('/all', authorize('admin'), queryValidation, handleValidationErrors, getAllComments);

// Comment CRUD operations
router.post('/', createCommentValidation, handleValidationErrors, createComment);
router.get('/:id', getComment);
router.put('/:id', updateCommentValidation, handleValidationErrors, updateComment);
router.delete('/:id', deleteComment);

// Like/Unlike routes
router.post('/:id/like', likeComment);
router.delete('/:id/like', unlikeComment);

// Moderation routes (Admin/Author only)
router.put('/:id/moderate', authorize('author', 'admin'), moderateComment);

// Reaction routes
router.post('/:id/reaction', addReactionToComment);
router.delete('/:id/reaction', removeReactionFromComment);

module.exports = router; 