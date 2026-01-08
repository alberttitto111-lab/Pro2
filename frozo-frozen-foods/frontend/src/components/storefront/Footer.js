import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Policy', href: '/shipping' },
  ];

  const categories = [
    { label: 'Vegetables', href: '/products?category=vegetables' },
    { label: 'Fruits', href: '/products?category=fruits' },
    { label: 'Ready Meals', href: '/products?category=ready-meals' },
    { label: 'Snacks', href: '/products?category=snacks' },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: 'https://facebook.com' },
    { icon: <TwitterIcon />, href: 'https://twitter.com' },
    { icon: <InstagramIcon />, href: 'https://instagram.com' },
    { icon: <YouTubeIcon />, href: 'https://youtube.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.light' }}>
              Frozo
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: 'grey.400' }}>
              Your trusted source for premium frozen foods. We deliver quality, 
              convenience, and freshness straight to your doorstep.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ mr: 1, fontSize: 'small', color: 'grey.400' }} />
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                123 Frozen Street, Cold City, CC 12345
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, fontSize: 'small', color: 'grey.400' }} />
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                (123) 456-7890
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1, fontSize: 'small', color: 'grey.400' }} />
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                info@frozo.com
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontSize: '1rem' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontSize: '1rem' }}>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {categories.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  {category.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontSize: '1rem' }}>
              Newsletter
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: 'grey.400', mb: 2 }}>
              Subscribe for updates, offers, and new arrivals
            </Typography>
            
            <Box component="form" sx={{ display: 'flex', mb: 3 }}>
              <TextField
                placeholder="Your email"
                size="small"
                sx={{
                  flexGrow: 1,
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'grey.800',
                    '& fieldset': {
                      borderColor: 'grey.700',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ whiteSpace: 'nowrap' }}
              >
                Subscribe
              </Button>
            </Box>

            {/* Social Links */}
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 1 }}>
              Follow us:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'grey.400',
                    bgcolor: 'grey.800',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                    },
                  }}
                  size="small"
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'grey.700' }} />

        {/* Copyright */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'grey.400', textAlign: 'center', mb: { xs: 2, sm: 0 } }}>
            © {currentYear} Frozo. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="/privacy"
              sx={{
                color: 'grey.400',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.light' },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              sx={{
                color: 'grey.400',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.light' },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              sx={{
                color: 'grey.400',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.light' },
              }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;