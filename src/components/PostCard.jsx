import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, CardActions, Avatar, Typography,
  IconButton, Button, TextField, Divider, Box, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Favorite, FavoriteBorder, ChatBubbleOutline, Send,
  MoreVert, Edit, Delete
} from '@mui/icons-material';
import API from '../services/api';

const PostCard = ({ post, onLike, onComment, currentUserId, onUpdate, onDelete }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  const isOwner = String(currentUserId) === String(post.user?._id || post.user);

  const isLiked = post.likes?.some((like) =>
    (typeof like === 'string' ? like === currentUserId : like._id === currentUserId)
  );

  // Menu Handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEditOpen = () => {
    setOpenEdit(true);
    handleMenuClose();
  };

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await API.patch(
        `/posts/${post._id}/like`,
        {},
        config
      );

      if (onLike) onLike(data);
    } catch (error) {
      console.error("Like failed:", error.response?.data?.message || error.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await API.post(
        `/posts/${post._id}/comment`,
        { text: commentText },
        config
      );

      setCommentText('');
      if (onComment) onComment(data);
    } catch (error) {
      console.error("Comment failed:", error.response?.data?.message || error.message);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await API.put(
        `/posts/${post._id}`,
        { content: editContent },
        config
      );

      onUpdate(data);
      setOpenEdit(false);
    } catch (error) {
      alert("Update failed: " + (error.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await API.delete(`/posts/${post._id}`, config);

        onDelete(post._id);
        alert("Post deleted!");
      } catch (error) {
        console.error("Delete error:", error.response?.data || error.message);
        alert("Delete failed. See console for details.");
      }
    }
    handleMenuClose();
  };

  return (
    <Card sx={{ borderRadius: 4, mb: 3, border: '1px solid #E5E7EB' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {(post.user?.name || post.username || 'U')[0]}
          </Avatar>
        }
        action={
          isOwner && (
            <>
              <IconButton onClick={handleMenuOpen}><MoreVert /></IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEditOpen}>
                  <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
              </Menu>
            </>
          )
        }
        title={post.user?.name || post.username || "User"}
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />

      <CardContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.content}
        </Typography>

        {/* ✅ IMAGE FIX */}
        {post.imageUrl && (
          <Box
            sx={{
              width: "100%",
              height: 300,
              overflow: "hidden",
              borderRadius: 2,
              mt: 1,
              bgcolor: "#f3f4f6"
            }}
          >
            <Box
              component="img"
              src={
                post.imageUrl.startsWith("blob:")
                  ? post.imageUrl
                  : post.imageUrl.startsWith("http")
                    ? post.imageUrl
                    : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${post.imageUrl}`
              }
              alt="post"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />
          </Box>
        )}
      </CardContent>

      <CardActions>
        {/* LIKE SECTION */}
        <IconButton onClick={handleLikeClick}>
          {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {post.likes?.length || 0} {/* This shows total likes */}
        </Typography>

        {/* COMMENT SECTION */}
        <IconButton onClick={() => setShowComments(!showComments)}>
          <ChatBubbleOutline />
        </IconButton>
        <Typography variant="body2">
          {post.comments?.length || 0} {/* This shows total comments */}
        </Typography>
      </CardActions>

      {showComments && (
        <Box sx={{ p: 2, bgcolor: '#f9f9f9' }}>
          <Divider sx={{ mb: 2 }} />
          {post.comments?.map((comment, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>{comment.username || "User"}:</strong> {comment.text}
              </Typography>
            </Box>
          ))}
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <IconButton type="submit" color="primary">
              <Send />
            </IconButton>
          </Box>
        </Box>
      )}

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostCard;