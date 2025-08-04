const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
const getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = { post: req.params.postId };

    // Filter by status (only show approved comments to public)
    if (req.user && (req.user.role === 'admin' || req.user.role === 'author')) {
      if (req.query.status) {
        query.status = req.query.status;
      }
    } else {
      query.status = 'approved';
    }

    const comments = await Comment.find(query)
      .populate('author', 'name avatar')
      .populate('replies')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Comment.countDocuments(query);

    res.json({
      success: true,
      count: comments.length,
      total,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Private
const getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('replies');

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user can view this comment
    if (comment.status !== 'approved' && 
        comment.author._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'author') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this comment'
      });
    }

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comment',
      error: error.message
    });
  }
};

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    // Check if post exists
    const post = await Post.findById(req.body.post);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if post is published
    if (post.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot comment on unpublished posts'
      });
    }

    // Check if parent comment exists (if provided)
    if (req.body.parentComment) {
      const parentComment = await Comment.findById(req.body.parentComment);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    // Add author to request body
    req.body.author = req.user.id;

    // Set status based on user role
    if (req.user.role === 'admin' || req.user.role === 'author') {
      req.body.status = 'approved';
    }

    const comment = await Comment.create(req.body);

    // Populate author info
    await comment.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: error.message
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Make sure user is comment author or admin/author
    if (comment.author.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'author') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'name avatar');

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: error.message
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Make sure user is comment author or admin/author
    if (comment.author.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'author') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

// @desc    Like a comment
// @route   POST /api/comments/:id/like
// @access  Private
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if already liked
    if (comment.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Comment already liked'
      });
    }

    comment.likes.push(req.user.id);
    await comment.save();

    res.json({
      success: true,
      message: 'Comment liked successfully',
      likeCount: comment.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking comment',
      error: error.message
    });
  }
};

// @desc    Unlike a comment
// @route   DELETE /api/comments/:id/like
// @access  Private
const unlikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if not liked
    if (!comment.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Comment not liked'
      });
    }

    // Remove like
    comment.likes = comment.likes.filter(
      like => like.toString() !== req.user.id
    );
    await comment.save();

    res.json({
      success: true,
      message: 'Comment unliked successfully',
      likeCount: comment.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unliking comment',
      error: error.message
    });
  }
};

// @desc    Moderate comment (approve/reject)
// @route   PUT /api/comments/:id/moderate
// @access  Private (Admin/Author)
const moderateComment = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected'
      });
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'name avatar');

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error moderating comment',
      error: error.message
    });
  }
};

module.exports = {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  moderateComment
}; 