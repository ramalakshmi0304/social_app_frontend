import React, { useState, useRef } from 'react'; // 1. Added useRef
import API from '../services/api';
import {
  Paper, TextField, Button, Box, Typography,
  IconButton, Avatar, Stack
} from '@mui/material';
import { Image, Send, Close } from '@mui/icons-material';


const CreatePost = ({ onPostCreated, user }) => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // 2. Store the actual File object
  const [previewUrl, setPreviewUrl] = useState(''); // 3. For the UI preview
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // 4. Ref for the hidden file input

  const isButtonDisabled = !content.trim() && !selectedFile;

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create temporary preview URL
    }
  };

  const handlePostSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();
  formData.append('content', content);
  if (selectedFile) {
    formData.append('image', selectedFile);
  }

  try {
    // Look how much cleaner this is! 
    // No need to pass headers: { Authorization: ... }
    const { data } = await API.post('/posts', formData); 

    setContent('');
    setSelectedFile(null);
    setPreviewUrl('');
    if (onPostCreated) onPostCreated(data);
    alert("Post created!");
  } catch (error) {
    console.error("Upload failed", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 2, maxWidth: 500, mx: 'auto' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>{user?.username?.[0]}</Avatar>
        <Typography variant="h6" sx={{ alignSelf: 'center', fontWeight: '500' }}>
          Share something, {user?.username}
        </Typography>
      </Stack>

      <Box component="form" onSubmit={handlePostSubmit}>
        <TextField
          fullWidth multiline rows={3}
          placeholder="What's on your mind?"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {/* Display Image Preview */}
        {previewUrl && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Box
              component="img"
              src={previewUrl}
              sx={{ width: '100%', borderRadius: 2, maxHeight: 300, objectFit: 'cover' }}
            />
            <IconButton
              sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.7)' }}
              onClick={() => { setSelectedFile(null); setPreviewUrl(''); }}
            >
              <Close size="small" />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<Image />}
            onClick={() => fileInputRef.current.click()} // Trigger hidden input
            sx={{ textTransform: 'none' }}
          >
            {selectedFile ? 'Change Image' : 'Add Image'}
          </Button>

          <Button
            type="submit"
            variant="contained"
            endIcon={<Send />}
            disabled={isButtonDisabled || loading}
            sx={{ borderRadius: 5, px: 4, textTransform: 'none', fontWeight: 'bold' }}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePost;