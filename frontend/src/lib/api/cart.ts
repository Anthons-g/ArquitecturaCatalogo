import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const cartApi = {
  getCart: async (token: string) => {
    const response = await axios.get(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  addToCart: async (
    token: string,
    item: {
      productId: string;
      quantity: number;
      size?: string;
      color?: string;
    }
  ) => {
    const response = await axios.post(`${API_URL}/cart/add`, item, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  updateCartItem: async (
    token: string,
    itemId: string,
    updates: {
      quantity?: number;
      size?: string;
      color?: string;
    }
  ) => {
    const response = await axios.patch(
      `${API_URL}/cart/item/${itemId}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },

  removeFromCart: async (token: string, itemId: string) => {
    const response = await axios.delete(`${API_URL}/cart/item/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  clearCart: async (token: string) => {
    const response = await axios.delete(`${API_URL}/cart/clear`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },
};

export { cartApi };
