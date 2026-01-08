import React from 'react';
import { Box } from '@mui/material';
import Header from '../storefront/Header';
import Footer from '../storefront/Footer';
import ScrollProgress from './ScrollProgress'; // Add this import

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Add ScrollProgress */}
      <ScrollProgress />
      
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;