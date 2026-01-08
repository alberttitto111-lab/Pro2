import React, { useContext, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Paper,
} from '@mui/material';
import {
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { AuthContext } from '../../App';

const LoginDialog = () => {
  const { showLogin, setShowLogin, login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShowLogin(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  // Update the handleSubmit function to use API login
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const result = await login(username, password);
    
    if (result.success) {
      // Success - dialog will close automatically
    } else {
      setError(result.error || 'Invalid credentials');
    }
  } catch (err) {
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog
      open={showLogin}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        p: 3,
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SecurityIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Admin Login
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Access the admin panel
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, pb: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Login Instructions */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: 'info.light', 
              color: 'info.dark',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'info.main'
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              <strong>Demo Credentials:</strong>
            </Typography>
            <Typography variant="body2">
              Username: <strong>admin</strong>
            </Typography>
            <Typography variant="body2">
              Password: <strong>admin123</strong>
            </Typography>
          </Paper>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Username Field */}
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            variant="outlined"
            required
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            margin="normal"
            variant="outlined"
            required
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !username || !password}
          startIcon={loading ? null : <SecurityIcon />}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </DialogActions>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary">
          Protected area. Unauthorized access is prohibited.
        </Typography>
      </Box>
    </Dialog>
  );
};

export default LoginDialog;