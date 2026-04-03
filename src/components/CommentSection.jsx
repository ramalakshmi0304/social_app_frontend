import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, Divider, Stack } from '@mui/material';
import { Send } from '@mui/icons-material';

const CommentSection = ({ comments, onCommentSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onCommentSubmit(text);
      setText(''); // Clear input after submission
    }
  };

  return (
    <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #eee' }}>
      {/* Existing Comments List */}
      <Stack spacing={2} sx={{ mb: 2, maxHeight: 300, overflowY: 'auto', pr: 1 }}>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1.5 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'grey.400' }}>
                {comment.username[0].toUpperCase()}
              </Avatar>
              <Box sx={{ bgcolor: '#f0f2f5', p: 1, borderRadius: 2, flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {comment.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {comment.text}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="caption" color="text.disabled" align="center" sx={{ display: 'block', my: 1 }}>
            No comments yet. Be the first to reply!
          </Typography>
        )}
      </Stack>

      {/* Input Field */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5, bgcolor: 'white' } }}
        />
        <IconButton 
          color="primary" 
          type="submit" 
          disabled={!text.trim()}
          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <Send sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CommentSection;