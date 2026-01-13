import React, { useContext, useState, useEffect } from 'react';
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
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../../App';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getUnreadCount } from '../../services/notificationApi';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count on component mount and set interval
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

const handleMobileMenuOpen = (event) => {
  setMobileMenuAnchor(event.currentTarget);
};

const handleMobileMenuClose = () => {
  setMobileMenuAnchor(null);
};


  const adminNavItems = [
    { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { 
      label: 'Notifications', 
      path: '/admin/notifications', 
      icon: (
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.6rem',
              height: '18px',
              minWidth: '18px',
              padding: '0 4px',
            }
          }}
        >
          <NotificationsIcon />
        </Badge>
      ) 
    },
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
          {/* <IconButton
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
          </IconButton> */}
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

        {/* Desktop Navigation */}
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


        {/* Tablet Navigation (768px) */}
        <Box sx={{ display: { xs: 'none', sm: 'flex', md: 'none' }, gap: 1 }}>
          <IconButton
            component={Link}
            to="/admin"
            color="inherit"
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <DashboardIcon />
          </IconButton>

          <IconButton
            component={Link}
            to="/admin/notifications"
            color="inherit"
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6rem',
                  height: '18px',
                  minWidth: '18px',
                  padding: '0 4px',
                }
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>


        {/* Mobile Navigation */}
        {/* Mobile Menu Button (xs only) */}
<Box sx={{ display: { xs: 'flex', sm: 'none' },ml: 'auto' }}>
  <IconButton
    color="inherit"
    onClick={handleMobileMenuOpen}
    sx={{
      bgcolor: 'rgba(255,255,255,0.1)',
      '&:hover': {
        bgcolor: 'rgba(255,255,255,0.2)',
      },
    }}
  >
    <MenuIcon />
  </IconButton>

  <Menu
    anchorEl={mobileMenuAnchor}
    open={Boolean(mobileMenuAnchor)}
    onClose={handleMobileMenuClose}
    PaperProps={{
      sx: {
        mt: 1.5,
        minWidth: 220,
        borderRadius: 2,
      },
    }}
  >
    {/* Dashboard */}
    <MenuItem
      component={Link}
      to="/admin"
      onClick={handleMobileMenuClose}
    >
      <DashboardIcon sx={{ mr: 1 }} />
      Dashboard
    </MenuItem>

    {/* Notifications */}
    <MenuItem
      component={Link}
      to="/admin/notifications"
      onClick={handleMobileMenuClose}
    >
      <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1 }}>
        <NotificationsIcon />
      </Badge>
      Notifications
    </MenuItem>

    {/* View Store */}
    <MenuItem
      component={Link}
      to="/"
      onClick={handleMobileMenuClose}
    >
      View Store
    </MenuItem>

    {/* Administrator */}
    <MenuItem disabled>
      <AccountCircleIcon sx={{ mr: 1 }} />
      Administrator
    </MenuItem>

    {/* Logout */}
    <MenuItem
      onClick={() => {
        handleLogout();
        handleMobileMenuClose();
      }}
      sx={{ color: 'error.main' }}
    >
      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
      Logout
    </MenuItem>
  </Menu>
</Box>



        {/* Right side - User menu and Store link */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
  component={Link}
  to="/"
  sx={{
    display: { xs: 'none', sm: 'inline-flex' },
    color: 'white',
    borderColor: 'white',
  }}
>
  View Store
</Button>


          {/* User Menu */}
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}> */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
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