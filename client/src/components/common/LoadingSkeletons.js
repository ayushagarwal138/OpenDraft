import React from 'react';
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';

// Post Card Skeleton
export const PostCardSkeleton = () => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width={100} height={16} />
          <Skeleton variant="text" width={80} height={16} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <Box>
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" height={48} width="40%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={24} width="60%" />
    </Box>

    {/* Analytics Cards */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" height={20} width="60%" />
                <Skeleton variant="text" height={16} width="40%" />
              </Box>
            </Box>
            <Skeleton variant="text" height={32} width="50%" />
          </Paper>
        </Grid>
      ))}
    </Grid>

    {/* Table Skeleton */}
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="text" height={32} width={150} />
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="text" height={20} width="100%" />
      </Box>
      
      {[1, 2, 3, 4, 5].map((item) => (
        <Box key={item} sx={{ display: 'flex', alignItems: 'center', py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="text" height={20} width="30%" sx={{ mr: 2 }} />
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1, mr: 2 }} />
          <Skeleton variant="text" height={20} width="15%" sx={{ mr: 2 }} />
          <Skeleton variant="text" height={20} width="10%" sx={{ mr: 2 }} />
          <Skeleton variant="text" height={20} width="10%" sx={{ mr: 2 }} />
          <Skeleton variant="text" height={20} width="15%" sx={{ mr: 2 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Box>
      ))}
    </Paper>
  </Box>
);

// Post Detail Skeleton
export const PostDetailSkeleton = () => (
  <Box>
    {/* Hero Section */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" height={48} width="80%" sx={{ mb: 2 }} />
      <Skeleton variant="text" height={24} width="60%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="40%" />
    </Box>

    {/* Featured Image */}
    <Skeleton
      variant="rectangular"
      height={400}
      sx={{ borderRadius: 2, mb: 4 }}
    />

    {/* Content */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" height={24} width="100%" sx={{ mb: 2 }} />
      <Skeleton variant="text" height={20} width="100%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="100%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="90%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="95%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="85%" sx={{ mb: 2 }} />
      
      <Skeleton variant="text" height={24} width="60%" sx={{ mb: 2 }} />
      <Skeleton variant="text" height={20} width="100%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="100%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
    </Box>

    {/* Tags */}
    <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
      <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={70} height={32} sx={{ borderRadius: 1 }} />
    </Box>
  </Box>
);

// Form Skeleton
export const FormSkeleton = () => (
  <Box>
    <Skeleton variant="text" height={48} width="40%" sx={{ mb: 4 }} />
    
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Skeleton variant="text" height={20} width="15%" sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Skeleton variant="text" height={20} width="15%" sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Skeleton variant="text" height={20} width="15%" sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        
        <Grid item xs={12}>
          <Skeleton variant="text" height={20} width="15%" sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={120} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        
        <Grid item xs={12}>
          <Skeleton variant="text" height={20} width="15%" sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={200} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
      </Box>
    </Paper>
  </Box>
);

// Comments Skeleton
export const CommentsSkeleton = () => (
  <Box>
    <Skeleton variant="text" height={32} width="30%" sx={{ mb: 3 }} />
    
    {[1, 2, 3].map((item) => (
      <Box key={item} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" height={20} width="30%" />
            <Skeleton variant="text" height={16} width="20%" />
          </Box>
        </Box>
        <Skeleton variant="text" height={20} width="100%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="60%" />
      </Box>
    ))}
  </Box>
);

// Search Results Skeleton
export const SearchResultsSkeleton = () => (
  <Box>
    <Skeleton variant="text" height={32} width="40%" sx={{ mb: 3 }} />
    
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <PostCardSkeleton />
        </Grid>
      ))}
    </Grid>
  </Box>
);

// Profile Skeleton
export const ProfileSkeleton = () => (
  <Box>
    {/* Profile Header */}
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="text" height={32} width="40%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="60%" />
    </Box>

    {/* Stats */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={6} sm={3} key={item}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Skeleton variant="text" height={32} width="60%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="80%" />
          </Paper>
        </Grid>
      ))}
    </Grid>

    {/* Recent Posts */}
    <Box>
      <Skeleton variant="text" height={32} width="30%" sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} md={4} key={item}>
            <PostCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

// Sidebar Skeleton
export const SidebarSkeleton = () => (
  <Box>
    <Skeleton variant="text" height={32} width="60%" sx={{ mb: 3 }} />
    
    {[1, 2, 3, 4, 5].map((item) => (
      <Box key={item} sx={{ mb: 2 }}>
        <Skeleton variant="text" height={20} width="100%" />
      </Box>
    ))}
    
    <Skeleton variant="text" height={32} width="50%" sx={{ mt: 4, mb: 3 }} />
    
    {[1, 2, 3].map((item) => (
      <Box key={item} sx={{ mb: 2 }}>
        <Skeleton variant="text" height={16} width="80%" />
        <Skeleton variant="text" height={16} width="60%" />
      </Box>
    ))}
  </Box>
);

// Loading Spinner with Text
export const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const sizes = {
    small: 24,
    medium: 40,
    large: 60,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
      <Skeleton variant="circular" width={sizes[size]} height={sizes[size]} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={20} width={100} />
    </Box>
  );
};

// Page Loading Skeleton
export const PageLoadingSkeleton = ({ type = 'default' }) => {
  switch (type) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'post-detail':
      return <PostDetailSkeleton />;
    case 'form':
      return <FormSkeleton />;
    case 'comments':
      return <CommentsSkeleton />;
    case 'search-results':
      return <SearchResultsSkeleton />;
    case 'profile':
      return <ProfileSkeleton />;
    case 'sidebar':
      return <SidebarSkeleton />;
    default:
      return <LoadingSpinner message="Loading page..." size="large" />;
  }
}; 