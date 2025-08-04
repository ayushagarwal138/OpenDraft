import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Error,
  Warning,
  Info,
  Notifications
} from '@mui/icons-material';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);


  // Mock notifications - in a real app, these would come from your backend
  const mockNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Post Published Successfully',
      message: 'Your post "Getting Started with React" has been published and is now live.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New Comment',
      message: 'John Doe commented on your post "Advanced JavaScript Tips".',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Draft Saved',
      message: 'Your draft "Web Development Best Practices" has been auto-saved.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: true
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, [mockNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'info':
        return <Info />;
      default:
        return <Notifications />;
    }
  };

  const getSeverity = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Notification Bell with Badge */}
      <Box sx={{ position: 'relative' }}>
        <IconButton
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: 'relative',
            '&:hover': {
              backgroundColor: 'primary.light',
            },
          }}
        >
          <Notifications />
          {unreadCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: 'error.main',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Box>
          )}
        </IconButton>
      </Box>

      {/* Notifications Panel */}
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Box
          sx={{
            width: 400,
            maxHeight: 500,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'primary.main',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </Box>
            {unreadCount > 0 && (
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>

          {/* Notifications List */}
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications yet
                </Typography>
              </Box>
            ) : (
              notifications.map((notification) => (
                <Box
                  key={notification.id}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: notification.read ? 'transparent' : 'primary.light',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        color: `${getSeverity(notification.type)}.main`,
                        mt: 0.5,
                      }}
                    >
                      {getIcon(notification.type)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(notification.timestamp)}
                      </Typography>
                    </Box>
                    {!notification.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          mt: 1,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Footer */}
          {notifications.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ cursor: 'pointer', fontWeight: 500 }}
              >
                Mark all as read
              </Typography>
            </Box>
          )}
        </Box>
      </Snackbar>
    </>
  );
};

export default NotificationSystem; 