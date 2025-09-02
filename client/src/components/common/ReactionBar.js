import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';

const DEFAULT_EMOJIS = ['👍','❤️','😂','👏','🔥','🎉'];

const ReactionBar = ({ type, id, reactions = {}, onReact, userId, disabled }) => {
  const handleReact = (emoji) => {
    if (disabled) return;
    const userReacted = reactions[emoji]?.includes(userId);
    onReact(emoji, !userReacted);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
      {DEFAULT_EMOJIS.map((emoji) => {
        const count = reactions[emoji]?.length || 0;
        const userReacted = reactions[emoji]?.includes(userId);
        return (
          <Tooltip key={emoji} title={userReacted ? 'Remove reaction' : 'React'}>
            <Chip
              label={
                <span style={{ fontSize: 18 }}>
                  {emoji} {count > 0 && <span style={{ fontWeight: 600, marginLeft: 2 }}>{count}</span>}
                </span>
              }
              color={userReacted ? 'primary' : 'default'}
              variant={userReacted ? 'filled' : 'outlined'}
              onClick={() => handleReact(emoji)}
              disabled={disabled}
              sx={{ cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 18 }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default ReactionBar;