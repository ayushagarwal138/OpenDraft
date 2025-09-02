const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserRole,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} = require('../controllers/userController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/:id/role', authorize('admin'), updateUserRole);

// Follow/Unfollow routes
router.post('/:id/follow', followUser);
router.delete('/:id/follow', unfollowUser);
// Followers/Following lists (public)
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

module.exports = router; 