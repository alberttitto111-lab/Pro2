import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '3px',
        backgroundColor: 'primary.main',
        zIndex: 9999,
        transition: 'width 0.1s ease-out',
        boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
      }}
    />
  );
};

export default ScrollProgress;