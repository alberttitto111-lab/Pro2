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
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { AuthContext } from '../../App';
import { useCart } from '../../contexts/CartContext'; // Add this import

// Add Wishlist icon import
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useWishlist } from '../../contexts/WishlistContext';


const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setShowLogin } = useContext(AuthContext);
  const { cart } = useCart(); // Get cart data
  const { wishlist } = useWishlist(); // Get wishlist data

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
    { label: 'Wishlist', path: '/wishlist' },
    // { label: 'Cart', path: '/cart' }, // Add Cart to menu
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
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

          {/* Desktop Navigation */}
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
                    color: item.label === 'Wishlist' ? 'secondary.main' : 'primary.main',
                    backgroundColor: item.label === 'Wishlist'  
                      ? 'rgba(255, 64, 129, 0.04)' 
                      : 'rgba(33, 150, 243, 0.04)'
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

            {/* Wishlist Icon with Badge */}
            <IconButton
              component={Link}
              to="/wishlist"
              color="secondary"
              size="medium"
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={wishlist.itemCount} color="error">
                <FavoriteIcon />
              </Badge>
            </IconButton>


            {/* Cart Icon with Badge */}
            <IconButton
              component={Link}
              to="/cart"
              color="primary"
              size="medium"
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={cart.totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
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