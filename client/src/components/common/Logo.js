import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

const Logo = ({ 
  height = '40px', 
  width = 'auto', 
  showText = true, 
  variant = 'default',
  sx = {} 
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // If image failed to load, show SVG fallback
  if (imageError) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
        <Box sx={{ width: height, height }}>
          <svg 
            // eslint-disable-next-line react/style-prop-object
            width="100%" 
            // eslint-disable-next-line react/style-prop-object
            height="100%" 
            viewBox="0 0 200 80" 
            xmlns="http://www.w3.org/2000/svg"
          >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1976d2;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#42a5f5;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle cx="40" cy="40" r="35" fill="url(#logoGradient)" opacity="0.1"/>
          
          {/* Main icon - pen/pencil */}
          <path d="M25 55 L45 35 L55 45 L35 65 Z" fill="url(#logoGradient)" stroke="url(#logoGradient)" strokeWidth="2"/>
          <circle cx="30" cy="60" r="3" fill="url(#logoGradient)"/>
          
          {showText && (
            <>
              {/* Text */}
              <text x="85" y="35" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="url(#logoGradient)">Open</text>
              <text x="85" y="55" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#1976d2">Draft</text>
            </>
          )}
        </svg>
        </Box>
      </Box>
    );
  }

  // Show text-only version for small sizes
  if (variant === 'text-only') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
        <Typography 
          variant="h6" 
          component="span"
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          OpenDraft
        </Typography>
      </Box>
    );
  }

  // Default: try to load PNG image with fallback
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
      <img
        src="/logo.png"
        alt="OpenDraft Logo"
        style={{
          height,
          width,
          objectFit: 'contain',
        }}
        onError={handleImageError}
      />
    </Box>
  );
};

export default Logo; 