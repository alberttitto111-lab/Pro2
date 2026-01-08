import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../../App';
import NotificationsIcon from '@mui/icons-material/Notifications';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { label: 'Products', path: '/admin/products', icon: <InventoryIcon /> },
    { label: 'Notifications', path: '/admin/notifications', icon: <NotificationsIcon /> },
  ];

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'secondary.main', 
        boxShadow: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Logo and Back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            component={Link}
            to="/admin"
            sx={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 700,
            }}
          >
            <DashboardIcon />
            Admin Panel
            <Chip 
              label="Protected" 
              size="small" 
              sx={{ 
                ml: 1, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                height: 20,
                fontSize: '0.7rem'
              }} 
            />
          </Typography>
        </Box>

        {/* Admin Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {adminNavItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
                borderRadius: 2,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Right side - User menu and Store link */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            View Store
          </Button>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
                ml: 1,
              }}
            >
              <AccountCircleIcon />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }
              }}
            >
              <MenuItem sx={{ py: 1.5, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    A
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Administrator
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      admin@frozo.com
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  py: 1.5, 
                  px: 2,
                  color: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.light',
                    color: 'error.dark'
                  }
                }}
              >
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;