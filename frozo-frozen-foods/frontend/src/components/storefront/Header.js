import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../../App';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setShowLogin } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
      setMobileOpen(false);
    } else {
      setShowLogin(true);
      setMobileOpen(false);
    }
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  // REMOVED THE VERTICAL MENU ITEMS FROM DRAWER CONTENT
  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            textDecoration: 'none'
          }}
        >
          Frozo
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {/* KEEP ONLY THE ADMIN BUTTON IN MOBILE DRAWER */}
        <ListItem
          onClick={handleAdminClick}
          sx={{
            color: 'secondary.main',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <ListItemText primary={isAuthenticated ? 'Admin Panel' : 'Admin Login'} />
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Your trusted source for premium frozen foods
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              Frozo
            </Typography>

            {/* Desktop Navigation - KEEP THIS */}
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              gap: { md: 1, lg: 2 },
              alignItems: 'center'
            }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: 'text.primary',
                    fontSize: { md: '0.9rem', lg: '1rem' },
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(33, 150, 243, 0.04)'
                    }
                  }}
                  onClick={() => {
                    setTimeout(() => {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }, 100);
                  }}
                >
                  {item.label}
                </Button>
              ))}
              
              {/* Admin Button */}
              <Button
                onClick={handleAdminClick}
                startIcon={<AdminPanelSettingsIcon />}
                sx={{
                  color: 'secondary.main',
                  fontWeight: 'bold',
                  fontSize: { md: '0.9rem', lg: '1rem' },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 64, 129, 0.04)'
                  }
                }}
              >
                {isAuthenticated ? 'Admin Panel' : 'Admin'}
              </Button>

              <IconButton
                color="primary"
                size="medium"
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={0} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>

            {/* Mobile Menu Button - KEEP FOR MOBILE DRAWER */}
            <Box sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1
            }}>
              <IconButton color="primary" size="medium">
                <Badge badgeContent={0} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton
                color="primary"
                onClick={handleDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>

      {/* Mobile Drawer - KEEP BUT ONLY FOR ADMIN ACCESS */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;