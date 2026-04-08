// components/Navbar.jsx
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Hub } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'primary.main', boxShadow: 1 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
          {/* Logo Section */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <Hub sx={{ mr: 1, fontSize: 30 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
              SOCIAL-HUB
            </Typography>
          </Box>

          {/* Actions Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'secondary.main',
                      fontSize: '0.9rem',
                    }}
                  >
                    {user.username[0].toUpperCase()}
                  </Avatar>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ fontWeight: 500 }}
                  >
                    {user.username}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleLogout}
                  sx={{ borderRadius: 5 }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login">
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  sx={{ borderRadius: 5 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;