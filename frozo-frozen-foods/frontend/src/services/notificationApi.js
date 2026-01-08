import API from './api';

// Notification APIs
export const getNotifications = async (params = {}) => {
  try {
    const response = await API.get('/notifications', { params });
    return response;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const getNotificationById = async (id) => {
  try {
    const response = await API.get(`/notifications/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching notification:', error);
    throw error;
  }
};

export const markAsRead = async (id) => {
  try {
    const response = await API.put(`/notifications/${id}/read`);
    return response;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAsReplied = async (id) => {
  try {
    const response = await API.put(`/notifications/${id}/replied`);
    return response;
  } catch (error) {
    console.error('Error marking notification as replied:', error);
    throw error;
  }
};

export const deleteNotification = async (id) => {
  try {
    const response = await API.delete(`/notifications/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await API.get('/notifications', {
      params: { status: 'unread', limit: 1 }
    });
    return response.data.unreadCount || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};