const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get all posts with pagination and filtering
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments({ status: 'published' });

    // Build query
    let query = { status: 'published' };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    // Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }

    // Search functionality
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name avatar bio')
      .sort({ publishedAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.json({
      success: true,
      count: posts.length,
      pagination,
      total,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ 
      slug: req.params.slug,
      status: 'published'
    }).populate('author', 'name avatar bio');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    // Check if user liked the post
    let isLiked = false;
    if (req.user) {
      isLiked = post.likes.includes(req.user.id);
    }

    res.json({
      success: true,
      data: {
        ...post.toObject(),
        isLiked
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Author/Admin)
const createPost = async (req, res) => {
  try {
    // Add author to request body
    req.body.author = req.user.id;

    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Author/Admin)
const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Make sure user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Author/Admin)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Make sure user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if already liked
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Post already liked'
      });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.json({
      success: true,
      message: 'Post liked successfully',
      likeCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking post',
      error: error.message
    });
  }
};

// @desc    Unlike a post
// @route   DELETE /api/posts/:id/like
// @access  Private
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if not liked
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Post not liked'
      });
    }

    // Remove like
    post.likes = post.likes.filter(
      like => like.toString() !== req.user.id
    );
    await post.save();

    res.json({
      success: true,
      message: 'Post unliked successfully',
      likeCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unliking post',
      error: error.message
    });
  }
};

// @desc    Get current user's posts
// @route   GET /api/posts/me/posts
// @access  Private
const getMyPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Post.countDocuments({ author: req.user.id });

    res.json({
      success: true,
      count: posts.length,
      total,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your posts',
      error: error.message
    });
  }
};

// @desc    Get posts by specific author
// @route   GET /api/posts/author/:authorId
// @access  Public
const getPostsByAuthor = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Check if author exists
    const author = await User.findById(req.params.authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    const posts = await Post.find({ 
      author: req.params.authorId,
      status: 'published'
    })
      .populate('author', 'name avatar bio')
      .sort({ publishedAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Post.countDocuments({ 
      author: req.params.authorId,
      status: 'published'
    });

    res.json({
      success: true,
      count: posts.length,
      total,
      author: {
        id: author._id,
        name: author.name,
        avatar: author.avatar,
        bio: author.bio
      },
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching author posts',
      error: error.message
    });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getMyPosts,
  getPostsByAuthor
}; 