import React, { useContext } from 'react'; // Make sure useContext is imported here
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { adminLogin, verifyToken } from './services/api';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetailPage from './pages/ProductDetailPage';
import Admin from './pages/Admin';
import Notifications from './pages/Notifications'; // Make sure this is imported
import AdminHeader from './components/admin/AdminHeader';
import LoginDialog from './components/auth/LoginDialog';
import About from './pages/About';
import Contact from './pages/Contact';
import ScrollToTop from './components/common/ScrollToTop'; // Add this import


// Create auth context
export const AuthContext = React.createContext();

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    secondary: {
      main: '#FF4081',
      light: '#FF79B0',
      dark: '#C60055',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
      fontWeight: 700,
    },
    h2: {
      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
      fontWeight: 600,
    },
    h3: {
      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
      fontWeight: 600,
    },
    h4: {
      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
      fontWeight: 600,
    },
    h5: {
      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
      fontWeight: 500,
    },
    h6: {
      fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
      fontWeight: 500,
    },
    body1: {
      fontSize: { xs: '0.875rem', sm: '1rem', md: '1rem' },
    },
    body2: {
      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem' },
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
          padding: { xs: '6px 12px', sm: '8px 16px', md: '10px 20px' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext); // useContext is used here

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};


const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, showLogin, setShowLogin } = useContext(AuthContext); // useContext is used her

  // Check if trying to access admin without auth
  React.useEffect(() => {
    if (location.pathname === '/admin' && !isAuthenticated) {
      setShowLogin(true);
    }
  }, [location, isAuthenticated, setShowLogin]);

  return (
    <>
      {/* Add ScrollToTop component */}
      <ScrollToTop />
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/products" element={
          <Layout>
            <Products />
          </Layout>
        } />
        <Route path="/products/:id" element={
          <Layout>
            <ProductDetailPage />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <Contact />
          </Layout>
        } />

        {/* Protected Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <>
              <AdminHeader />
              <Admin />
            </>
          </ProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <ProtectedRoute>
            <>
              <AdminHeader />
              <Notifications />
            </>
          </ProtectedRoute>
        } />

        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Login Dialog */}
      <LoginDialog />
    </>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [adminData, setAdminData] = React.useState(null);


 // Check existing token on app load
  React.useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await verifyToken();
        if (response.data.success) {
          setIsAuthenticated(true);
          setAdminData(response.data.admin);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);


   const login = async (username, password) => {
    try {
      const response = await adminLogin({ username, password });
      if (response.data.success) {
        const { token, admin } = response.data;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminData', JSON.stringify(admin));
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        setAdminData(admin);
        setShowLogin(false);
        return { success: true, admin };
      }
      return { success: false, error: response.data.error };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setAdminData(null);
  };

  const authContextValue = {
    isAuthenticated,
    adminData,
    login,
    logout,
    showLogin,
    setShowLogin,
    loading
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <AppContent />
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;