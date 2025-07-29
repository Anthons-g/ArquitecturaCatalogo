import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Notification {
  _id: string;
  userId: string;
  type:
    | 'order_confirmed'
    | 'order_shipped'
    | 'order_delivered'
    | 'order_cancelled'
    | 'payment_success'
    | 'payment_failed'
    | 'product_back_in_stock'
    | 'promotion'
    | 'welcome'
    | 'newsletter';
  channel: 'email' | 'sms' | 'push' | 'in_app';
  title: string;
  message: string;
  data?: any;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  sentAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

const notificationsApi = {
  getUserNotifications: async (
    token: string,
    page: number = 1,
    limit: number = 20
  ) => {
    const response = await axios.get(
      `${API_URL}/notifications?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },

  getUnreadCount: async (token: string) => {
    const response = await axios.get(`${API_URL}/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  markAsRead: async (token: string, notificationId: string) => {
    const response = await axios.patch(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },

  markAllAsRead: async (token: string) => {
    const response = await axios.patch(
      `${API_URL}/notifications/mark-all-read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },
};

export { notificationsApi };
