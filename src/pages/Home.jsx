import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import {
  Container, Box, CircularProgress, Typography, Alert,
  Avatar, IconButton, InputBase, Badge, Paper, Stack,
  AppBar, Toolbar, Tabs, Tab, BottomNavigation, BottomNavigationAction
} from '@mui/material';
import {
  Search, Notifications, DarkMode as DarkModeIcon,
  Home, Assignment, People, Chat, EmojiEvents
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [bottomNavValue, setBottomNavValue] = useState(2); // Set to 2 to match 'Social' index
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts'); // Uses http://localhost:5000/api/posts
      setPosts(data);
      setAllPosts(data);
    } catch (err) {
      console.error("Fetch failed", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // --- CRUD HANDLERS ---
  const handlePostCreated = (newPost) => setPosts([newPost, ...posts]);
  
  const handlePostDelete = (postId) => setPosts(prev => prev.filter(p => p._id !== postId));
  
  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  // --- INTERACTION HANDLERS (Fixes the "not a function" error) ---
  const handleLikeUpdate = (updatedPost) => {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const handleCommentUpdate = (updatedPost) => {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setPosts(allPosts);
      return;
    }
    try {
      const { data } = await API.get(`/posts/search?q=${searchQuery}`);
      setPosts(data);
    } catch (err) {
      const filtered = allPosts.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPosts(filtered);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: '#F4F7FE' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F4F7FE' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 'lg', margin: '0 auto', width: '100%' }}>
          <Typography variant="h6" fontWeight={800} color="primary">SOCIAL</Typography>

          <Paper sx={{ p: '2px 10px', display: 'flex', alignItems: 'center', width: { xs: '65%', sm: 350 }, bgcolor: '#F4F7FE', borderRadius: 3 }} elevation={0}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <IconButton onClick={handleSearch} sx={{ p: '5px', color: 'primary.main' }}><Search /></IconButton>
          </Paper>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton><DarkModeIcon fontSize="small" /></IconButton>
            <Badge badgeContent={4} color="error"><IconButton><Notifications fontSize="small" /></IconButton></Badge>
            <Avatar src={user?.profilePic} sx={{ width: 35, height: 35, border: '2px solid #1976d2' }} />
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ flex: 1, py: 3, pb: 12 }}>
        {user && <CreatePost user={user} onPostCreated={handlePostCreated} />}

        <Paper sx={{ borderRadius: 3, bgcolor: 'transparent', mb: 2 }} elevation={0}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable">
            <Tab label="All Posts" />
            <Tab label="For You" />
            <Tab label="Most Liked" />
          </Tabs>
        </Paper>

        <Stack spacing={3}>
          {posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              currentUserId={user?._id} 
              onLike={handleLikeUpdate}       // Added this
              onComment={handleCommentUpdate} // Added this
              onUpdate={handlePostUpdate} 
              onDelete={handlePostDelete} 
            />
          ))}
        </Stack>
      </Container>

      {/* Bottom Navigation Code remains same... */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 70, display: 'flex', justifyContent: 'center', bgcolor: 'white' }} elevation={8}>
         <BottomNavigation value={bottomNavValue} onChange={(_, v) => setBottomNavValue(v)} showLabels sx={{ width: '100%', maxWidth: 500 }}>
           <BottomNavigationAction label="Home" icon={<Home />} />
           <BottomNavigationAction label="Tasks" icon={<Assignment />} />
           <BottomNavigationAction
             label="Social"
             icon={<People sx={{ color: 'white', fontSize: 32 }} />}
             sx={{
               position: 'relative', top: -35, bgcolor: '#1976d2', borderRadius: '50%', height: 75,
               border: '8px solid #F4F7FE', boxShadow: '0 10px 20px rgba(25, 118, 210, 0.3)'
             }}
           />
           <BottomNavigationAction label="Chat" icon={<Chat />} />
           <BottomNavigationAction label="Events" icon={<EmojiEvents />} />
         </BottomNavigation>
       </Paper>
    </Box>
  );
};

export default HomePage;