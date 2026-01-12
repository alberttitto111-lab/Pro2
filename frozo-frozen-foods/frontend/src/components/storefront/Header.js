import React, { useContext, useState } from 'react';
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
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { AuthContext } from '../../App';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import FavoriteIcon from '@mui/icons-material/Favorite';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const { isAuthenticated, setShowLogin } = useContext(AuthContext);
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      setShowLogin(true);
    }
    setMobileMenuOpen(false); //newly added
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Products', path: '/products', icon: <CategoryIcon /> },
    { label: 'About', path: '/about', icon: <InfoIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactMailIcon /> },
  ];

  // Check if current path matches or starts with menu item path
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };


  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };

  // Mobile menu content
  const mobileMenuContent = (
    <Box sx={{ width: 280, p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Menu
        </Typography>
        <IconButton onClick={handleMobileMenuToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Navigation Items */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.label}
            component={Link}
            to={item.path}
            onClick={handleMobileMenuToggle}
            sx={{
              borderRadius: 1,
              mb: 1,
              bgcolor: isActive(item.path) ? 'primary.light' : 'transparent',
              color: isActive(item.path) ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                bgcolor: isActive(item.path) ? 'primary.main' : 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.contrastText' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 600 : 400
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Admin Section */}
      <List>
        <ListItem
          onClick={handleAdminClick}
          sx={{
            borderRadius: 1,
            mb: 1,
            cursor: 'pointer',
            bgcolor: (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) ? 'secondary.light' : 'transparent',
            color: (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) ? 'secondary.contrastText' : 'text.primary',
            '&:hover': {
              bgcolor: (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) ? 'secondary.main' : 'action.hover',
            }
          }}
        >
          <ListItemIcon sx={{ color: (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) ? 'secondary.contrastText' : 'inherit' }}>
            <AdminPanelSettingsIcon />
          </ListItemIcon>
          <ListItemText 
            primary={isAuthenticated ? 'Admin Panel' : 'Admin Login'}
            primaryTypographyProps={{
              fontWeight: (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) ? 600 : 400
            }}
          />
        </ListItem>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Wishlist and Cart */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <IconButton
          component={Link}
          to="/wishlist"
          onClick={handleMobileMenuToggle}
          color={isActive('/wishlist') ? 'secondary' : 'default'}
          sx={{
            flexDirection: 'column',
            width: 80,
            height: 80,
            borderRadius: 2,
            border: isActive('/wishlist') ? '2px solid' : '1px solid',
            borderColor: isActive('/wishlist') ? 'secondary.main' : 'divider',
            bgcolor: isActive('/wishlist') ? 'secondary.light' : 'background.paper',
          }}
        >
          <Badge badgeContent={wishlist.itemCount} color="error">
            <FavoriteIcon />
          </Badge>
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            Wishlist
          </Typography>
        </IconButton>
        
        <IconButton
          component={Link}
          to="/cart"
          onClick={handleMobileMenuToggle}
          color={isActive('/cart') ? 'primary' : 'default'}
          sx={{
            flexDirection: 'column',
            width: 80,
            height: 80,
            borderRadius: 2,
            border: isActive('/cart') ? '2px solid' : '1px solid',
            borderColor: isActive('/cart') ? 'primary.main' : 'divider',
            bgcolor: isActive('/cart') ? 'primary.light' : 'background.paper',
          }}
        >
          <Badge badgeContent={cart.totalItems} color="error">
            <ShoppingCartIcon />
          </Badge>
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            Cart
          </Typography>
        </IconButton>
      </Box>
    </Box>
  );



  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          px: { xs: 0, sm: 2 },
          minHeight: '64px', // Ensure consistent height
          alignItems: 'center' // Center align vertically
        }}>
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

          {/* Desktop Navigation - ALL ITEMS IN ONE FLEX CONTAINER */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: { md: 1, lg: 2 },
            height: '100%'
          }}>
            {/* Main Navigation Buttons */}
            {menuItems.map((item) => (
              <Box key={item.label} sx={{ position: 'relative', height: '100%' }}>
                <Button
                  component={Link}
                  to={item.path}
                  sx={{
                    color: 'text.primary',
                    fontSize: { md: '0.9rem', lg: '1rem' },
                    fontWeight: isActive(item.path) ? 600 : 400,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    padding: '0 16px',
                    minHeight: '64px',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.04)',
                    }
                  }}
                >
                  {item.label}
                  {/* Green underline for active page */}
                  {isActive(item.path) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: '#4CAF50', // Green color
                        borderRadius: '3px 3px 0 0'
                      }}
                    />
                  )}
                </Button>
              </Box>
            ))}

            {/* Admin Button */}
            <Box sx={{ position: 'relative', height: '100%' }}>
              <Button
                onClick={handleAdminClick}
                startIcon={<AdminPanelSettingsIcon />}
                sx={{
                  color: 'secondary.main',
                  fontSize: { md: '0.9rem', lg: '1rem' },
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  padding: '0 16px',
                  minHeight: '64px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 64, 129, 0.04)'
                  }
                }}
              >
                {isAuthenticated ? 'Admin Panel' : 'Admin'}
                {/* Green underline for active admin page */}
                {(location.pathname === '/admin' || location.pathname.startsWith('/admin/')) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#4CAF50',
                      borderRadius: '3px 3px 0 0'
                    }}
                  />
                )}
              </Button>
            </Box>

            {/* Wishlist Icon with Badge */}
            <Box sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
              <IconButton
                component={Link}
                to="/wishlist"
                color={isActive('/wishlist') ? 'secondary' : 'default'}
                sx={{
                  height: '100%',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  minHeight: '64px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 64, 129, 0.04)'
                  }
                }}
              >
                <Badge badgeContent={wishlist.itemCount} color="error">
                  <FavoriteIcon />
                </Badge>
                {/* Green underline for active wishlist page */}
                {isActive('/wishlist') && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#4CAF50',
                      borderRadius: '3px 3px 0 0'
                    }}
                  />
                )}
              </IconButton>
            </Box>

            {/* Cart Icon with Badge */}
            <Box sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
              <IconButton
                component={Link}
                to="/cart"
                color={isActive('/cart') ? 'primary' : 'default'}
                sx={{
                  height: '100%',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  minHeight: '64px',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.04)'
                  }
                }}
              >
                <Badge badgeContent={cart.totalItems} color="error">
                  <ShoppingCartIcon />
                </Badge>
                {/* Green underline for active cart page */}
                {isActive('/cart') && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#4CAF50',
                      borderRadius: '3px 3px 0 0'
                    }}
                  />
                )}
              </IconButton>
            </Box>
          </Box>

          {/* Mobile View */}
          <Box sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 1
          }}>
            <IconButton
              component={Link}
              to="/cart"
              color="primary"
              size="medium"
            >
              <Badge badgeContent={cart.totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Wishlist Icon for mobile (always visible) */}
            <IconButton
              component={Link}
              to="/wishlist"
              color="secondary"
              size="medium"
            >
              <Badge badgeContent={wishlist.itemCount} color="error">
                <FavoriteIcon />
              </Badge>
            </IconButton>

            {/* Menu Button */}
            <IconButton
              color="inherit"
              onClick={handleMobileMenuToggle}
              sx={{
                ml: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {mobileMenuContent}
      </Drawer>
    </AppBar>
  );
};

export default Header;