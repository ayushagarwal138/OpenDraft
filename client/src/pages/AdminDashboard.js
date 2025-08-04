import React, { useState, useEffect } from 'react';

import { People, Article, Comment, TrendingUp, Refresh, Edit, Delete } from '@mui/icons-material';
import { Container, Alert, Box, CircularProgress, Typography, Grid, Card, CardContent, Paper, Tabs, Tab, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, FormControl, Select, MenuItem, Chip, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, TextField, InputLabel, DialogActions } from '@mui/material';import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import postService from '../services/postService';
import commentService from '../services/commentService';

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [analytics, setAnalytics] = useState({});
  
  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserData, setEditUserData] = useState({});

  // Check if user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      return;
    }
    fetchAdminData();
  }, [currentUser]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, postsRes, commentsRes] = await Promise.all([
        userService.getAllUsers(),
        postService.getAllPosts(),
        commentService.getAllComments()
      ]);

      setUsers(usersRes.data.users);
      setPosts(postsRes.data.posts);
      setComments(commentsRes.data.comments);
      
      // Calculate analytics
      const analyticsData = calculateAnalytics(usersRes.data.users, postsRes.data.posts, commentsRes.data.comments);
      setAnalytics(analyticsData);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (users, posts, comments) => {
    const totalUsers = users.length;
    const totalPosts = posts.length;
    const totalComments = comments.length;
    const activeUsers = users.filter(u => u.lastLogin > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const draftPosts = posts.filter(p => p.status === 'draft').length;
    const pendingComments = comments.filter(c => c.status === 'pending').length;

    return {
      totalUsers,
      totalPosts,
      totalComments,
      activeUsers,
      publishedPosts,
      draftPosts,
      pendingComments,
      engagementRate: totalPosts > 0 ? ((totalComments + totalPosts) / totalUsers * 100).toFixed(2) : 0
    };
  };

  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    });
    setUserDialogOpen(true);
  };

  const handleUserUpdate = async () => {
    try {
      await userService.updateUser(selectedUser._id, editUserData);
      setUserDialogOpen(false);
      fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleUserDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        fetchAdminData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user role');
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users, content, and monitor site analytics
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {analytics.totalUsers}
                  </Typography>
                </Box>
                <People color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Posts
                  </Typography>
                  <Typography variant="h4">
                    {analytics.totalPosts}
                  </Typography>
                </Box>
                <Article color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Comments
                  </Typography>
                  <Typography variant="h4">
                    {analytics.totalComments}
                  </Typography>
                </Box>
                <Comment color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Engagement Rate
                  </Typography>
                  <Typography variant="h4">
                    {analytics.engagementRate}%
                  </Typography>
                </Box>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Users" />
          <Tab label="Posts" />
          <Tab label="Comments" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">User Management</Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchAdminData}
            >
              Refresh
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                     disabled={user._id === currentUser?._id} // Prevent admin from changing their own role
                        >
                          <MenuItem value="reader">Reader</MenuItem>
                          <MenuItem value="author">Author</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isVerified ? 'Verified' : 'Unverified'}
                        color={user.isVerified ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit User">
                          <IconButton size="small" onClick={() => handleUserEdit(user)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleUserDelete(user._id)}
                                                         disabled={user._id === currentUser?._id} // Prevent admin from deleting themselves
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Content Management</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Published Posts</Typography>
                    <Typography variant="h4" color="success.main">
                      {analytics.publishedPosts}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Draft Posts</Typography>
                    <Typography variant="h4" color="warning.main">
                      {analytics.draftPosts}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Comment Moderation</Typography>
            <Card>
              <CardContent>
                <Typography variant="h6">Pending Comments</Typography>
                <Typography variant="h4" color="warning.main">
                  {analytics.pendingComments}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Site Analytics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Active Users (7 days)</Typography>
                    <Typography variant="h4" color="primary.main">
                      {analytics.activeUsers}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Engagement Rate</Typography>
                    <Typography variant="h4" color="secondary.main">
                      {analytics.engagementRate}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      {/* Edit User Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={editUserData.name || ''}
              onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={editUserData.email || ''}
              onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={editUserData.role || 'reader'}
                onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                label="Role"
              >
                <MenuItem value="reader">Reader</MenuItem>
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUserUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 