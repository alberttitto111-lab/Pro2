import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  Badge,
  Tooltip,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Subject,
  AccessTime,
  CheckCircle,
  Delete,
  Reply,
  Refresh,
  Search,
  FilterList,
  MarkEmailRead,
  Archive
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  getNotifications,
  markAsRead,
  markAsReplied,
  deleteNotification,
  getUnreadCount
} from '../services/notificationApi';
import { Grid } from '@mui/material';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from API (updated with detailed logging)
  const fetchNotifications = async () => {
  try {
    setLoading(true);
    setError('');
    console.log('🔍 Fetching notifications with filters:', filters);
    
    const response = await getNotifications(filters);
    console.log('📥 Notifications response:', response.data);
    
    if (response.data && response.data.success) {
      setNotifications(response.data.notifications || []);
      setPagination({
        total: response.data.total || 0,
        pages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1
      });
      setUnreadCount(response.data.unreadCount || 0);
      console.log(`✅ Loaded ${response.data.notifications?.length || 0} notifications`);
    } else {
      console.error('❌ Server returned unsuccessful response:', response.data);
      setError('Failed to load notifications');
    }
  } catch (err) {
    console.error('❌ Error fetching notifications:', err);
    if (err.response) {
      console.error('Error response:', err.response.data);
    }
    setError('Failed to load notifications. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const fetchUnreadCount = async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
  };

  useEffect(() => {
    fetchNotifications();
  }, [filters]);

  useEffect(() => {
    fetchUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 }) // Reset to page 1 when changing filters
    }));
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setDetailDialogOpen(true);
    
    // Mark as read if unread
    if (notification.status === 'unread') {
      markAsRead(notification._id);
      setNotifications(prev =>
        prev.map(n =>
          n._id === notification._id
            ? { ...n, status: 'read', readAt: new Date() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n =>
          n._id === id
            ? { ...n, status: 'read', readAt: new Date() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAsReplied = async (id) => {
    try {
      await markAsReplied(id);
      setNotifications(prev =>
        prev.map(n =>
          n._id === id
            ? { ...n, status: 'replied', repliedAt: new Date() }
            : n
        )
      );
    } catch (err) {
      console.error('Error marking as replied:', err);
    }
  };

  const handleDeleteClick = (notification) => {
    setNotificationToDelete(notification);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (notificationToDelete) {
      try {
        await deleteNotification(notificationToDelete._id);
        setNotifications(prev =>
          prev.filter(n => n._id !== notificationToDelete._id)
        );
        if (notificationToDelete.status === 'unread') {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        setDeleteDialogOpen(false);
        setNotificationToDelete(null);
      } catch (err) {
        console.error('Error deleting notification:', err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNotificationToDelete(null);
  };

  const handlePageChange = (event, value) => {
    handleFilterChange('page', value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      unread: 'error',
      read: 'info',
      replied: 'success',
      archived: 'default'
    };
    return colors[status] || 'default';
  };

  const StatusBadge = ({ status }) => (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={getStatusColor(status)}
      size="small"
      variant="outlined"
    />
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Customer Messages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and respond to customer inquiries from the contact form
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Badge badgeContent={unreadCount} color="error" sx={{ mb: 2 }}>
                <Email sx={{ fontSize: 40, color: '#FF4081' }} />
              </Badge>
              <Typography variant="h5" gutterBottom>
                {unreadCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unread Messages
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {notifications.filter(n => n.status === 'replied').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Replied
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTime sx={{ fontSize: 40, color: '#2196F3', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {notifications.filter(n => n.status === 'read').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Read
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Archive sx={{ fontSize: 40, color: '#9C27B0', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {notifications.filter(n => n.status === 'archived').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Archived
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search messages..."
            size="small"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">All Messages</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="replied">Replied</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchNotifications}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Notifications Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Received</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Alert severity="error">{error}</Alert>
                  </TableCell>
                </TableRow>
              ) : notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Email sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No messages found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customer messages will appear here when they contact you
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
                  <TableRow
                    key={notification._id}
                    hover
                    sx={{
                      bgcolor: notification.status === 'unread' ? '#FFF8E1' : 'inherit',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleViewDetails(notification)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Person sx={{ color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {notification.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {notification.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: notification.status === 'unread' ? 600 : 400 }}>
                        {notification.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {notification.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={notification.status} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(notification.createdAt)}
                      </Typography>
                      {notification.readAt && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Read: {formatDate(notification.readAt)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {notification.status === 'unread' && (
                          <Tooltip title="Mark as read">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleMarkAsRead(notification._id)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        )}
                        {notification.status !== 'replied' && (
                          <Tooltip title="Mark as replied">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleMarkAsReplied(notification._id)}
                            >
                              <Reply />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(notification)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!loading && notifications.length > 0 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={pagination.pages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Paper>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {selectedNotification.subject}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <StatusBadge status={selectedNotification.status} />
                    <Typography variant="caption" color="text.secondary">
                      Received: {formatDate(selectedNotification.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setDetailDialogOpen(false)} size="small">
                  <VisibilityOff />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Customer Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" />
                        <Typography variant="body2">
                          <strong>Name:</strong> {selectedNotification.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" />
                        <Typography variant="body2">
                          <strong>Email:</strong> {selectedNotification.email}
                        </Typography>
                      </Box>
                      {selectedNotification.ipAddress && (
                        <Typography variant="caption" color="text.secondary">
                          IP: {selectedNotification.ipAddress}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Message
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {selectedNotification.message}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button
                onClick={() => {
                  window.location.href = `mailto:${selectedNotification.email}?subject=Re: ${selectedNotification.subject}`;
                  handleMarkAsReplied(selectedNotification._id);
                  setDetailDialogOpen(false);
                }}
                variant="contained"
                startIcon={<Reply />}
                sx={{ mr: 2 }}
              >
                Reply via Email
              </Button>
              <Button
                onClick={() => handleMarkAsReplied(selectedNotification._id)}
                variant="outlined"
                startIcon={<CheckCircle />}
                sx={{ mr: 2 }}
              >
                Mark as Replied
              </Button>
              <Button
                onClick={() => handleDeleteClick(selectedNotification)}
                color="error"
                variant="outlined"
                startIcon={<Delete />}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this message from {notificationToDelete?.name}?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. The message will be permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Notifications;