// components/CreatePost.jsx
import React, { useState, useRef } from 'react';
import API from '../services/api';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  Stack,
} from '@mui/material';
import { Image, Send, Close } from '@mui/icons-material';

const CreatePost = ({ onPostCreated, user }) => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const isButtonDisabled = !content.trim() && !selectedFile;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submissions
    if (loading) return; 
    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      // NOTE: Your API interceptor (in services/api.js) will 
      // automatically attach the 'Authorization' header here.
      const { data } = await API.post('/posts', formData);

      // 1. Reset text and preview
      setContent('');
      setSelectedFile(null);
      setPreviewUrl('');
      
      // 2. Reset the hidden file input so it can be used again
      if (fileInputRef.current) fileInputRef.current.value = '';

      // 3. Callback to parent (Feed) to show the new post
      if (onPostCreated) onPostCreated(data);
      
      alert('Post shared successfully!');
    } catch (error) {
      // Detailed error logging
      const errorMsg = error.response?.data?.message || error.message || 'Error creating post';
      console.error('Post Error:', errorMsg);
      alert(`Upload failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Paper
      elevation={3}
      sx={{ p: 2, mb: 4, borderRadius: 2, maxWidth: 500, mx: 'auto' }}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {user?.username?.[0]?.toUpperCase()}
        </Avatar>
        <Typography
          variant="h6"
          sx={{ alignSelf: 'center', fontWeight: '500' }}
        >
          Share something, {user?.username}
        </Typography>
      </Stack>

      <Box component="form" onSubmit={handlePostSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />

        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {previewUrl && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Box
              component="img"
              src={previewUrl}
              sx={{
                width: '100%',
                borderRadius: 2,
                maxHeight: 300,
                objectFit: 'cover',
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 5,
                right: 5,
                bgcolor: 'rgba(255,255,255,0.7)',
              }}
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl('');
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            startIcon={<Image />}
            onClick={() => fileInputRef.current.click()}
            sx={{ textTransform: 'none' }}
          >
            {selectedFile ? 'Change Image' : 'Add Image'}
          </Button>

          <Button
            type="submit"
            variant="contained"
            endIcon={<Send />}
            disabled={isButtonDisabled || loading}
            sx={{
              borderRadius: 5,
              px: 4,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePost;