import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Smooth scroll
    });
    
    // Also focus on main content for accessibility
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;