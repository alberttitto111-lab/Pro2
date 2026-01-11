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
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { AuthContext } from '../../App';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const { isAuthenticated, setShowLogin } = useContext(AuthContext);
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      setShowLogin(true);
    }
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  // Check if current path matches or starts with menu item path
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;