import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import postService from '../../services/postService';
import commentService from '../../services/commentService';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Avatar,
  Divider,
  Paper,
  TextField,
  Card,
  CardContent
} from '@mui/material';
import {
  CalendarToday,
  Visibility,
  Favorite,
  FavoriteBorder,
  Comment,
  Share
} from '@mui/icons-material';

const PostDetail = () => {
  const { slug } = useParams();
  // eslint-disable-next-line no-unused-vars
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const response = await postService.getPost(slug);
      setPost(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchComments = useCallback(async (postId) => {
    if (!postId) return;
    try {
      const response = await commentService.getComments(postId);
      setComments(response.data.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPost();
  }, [slug, fetchPost]);

  useEffect(() => {
    if (post?._id) {
      fetchComments(post._id);
    }
  }, [post?._id, fetchComments]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setError('Please login to like posts');
      return;
    }

    try {
      if (post.isLiked) {
        await postService.unlikePost(post._id);
        setPost(prev => ({
          ...prev,
          isLiked: false,
          likeCount: prev.likeCount - 1
        }));
      } else {
        await postService.likePost(post._id);
        setPost(prev => ({
          ...prev,
          isLiked: true,
          likeCount: prev.likeCount + 1
        }));
      }
    } catch (err) {
      setError('Failed to update like');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await commentService.createComment({
        content: commentText,
        post: post._id
      });
      
      setComments(prev => [response.data.data, ...prev]);
      setCommentText('');
    } catch (err) {
      setError('Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Post not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Post Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        {post.excerpt && (
          <Typography variant="h6" color="text.secondary" paragraph>
            {post.excerpt}
          </Typography>
        )}

        {/* Post Meta */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={post.author?.avatar} alt={post.author?.name} />
            <Typography variant="body2">
              {post.author?.name}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility sx={{ fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {post.views} views
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}

        {/* Featured Image */}
        {post.featuredImage && (
          <Box sx={{ mb: 4 }}>
            <img
              src={post.featuredImage}
              alt={post.title}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Box>
        )}
      </Box>

      {/* Post Content */}
      <Box sx={{ mb: 4 }}>
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            lineHeight: 1.8,
            fontSize: '1.1rem'
          }}
        />
      </Box>

      {/* Post Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant={post.isLiked ? "contained" : "outlined"}
          startIcon={post.isLiked ? <Favorite /> : <FavoriteBorder />}
          onClick={handleLike}
          disabled={!isAuthenticated}
        >
          {post.likeCount || 0} Likes
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Comment />}
        >
          {comments.length} Comments
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Share />}
        >
          Share
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Comments Section */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Comments ({comments.length})
        </Typography>

        {/* Add Comment */}
        {isAuthenticated && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleCommentSubmit}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submittingComment}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={submittingComment || !commentText.trim()}
              >
                {submittingComment ? <CircularProgress size={20} /> : 'Post Comment'}
              </Button>
            </form>
          </Paper>
        )}

        {/* Comments List */}
        <Box>
          {comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No comments yet. Be the first to comment!
            </Typography>
          ) : (
            comments.map((comment) => (
              <Card key={comment._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      src={comment.author?.avatar}
                      alt={comment.author?.name}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <Typography variant="subtitle2">
                      {comment.author?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {comment.content}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default PostDetail; 