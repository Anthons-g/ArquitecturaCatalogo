import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ProductFilters {
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  brand?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  gender?: string;
  stock: number;
  images?: string[];
  featured?: boolean;
  tags?: string[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  gender?: string;
  stock?: number;
  images?: string[];
  featured?: boolean;
  tags?: string[];
}

const productsApi = {
  getProducts: async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await axios.get(
      `${API_URL}/products?${params.toString()}`
    );
    return response.data.data;
  },

  getProduct: async (id: string) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data.data;
  },

  getFeaturedProducts: async (limit: number = 10) => {
    const response = await axios.get(
      `${API_URL}/products/featured?limit=${limit}`
    );
    return response.data.data;
  },

  getProductsByCategory: async (category: string) => {
    const response = await axios.get(
      `${API_URL}/products/category/${category}`
    );
    return response.data.data;
  },

  searchProducts: async (query: string, filters: ProductFilters = {}) => {
    const searchFilters = { ...filters, search: query };
    return productsApi.getProducts(searchFilters);
  },

  // Admin functions - CRUD básico
  createProduct: async (token: string, productData: CreateProductData) => {
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Crear producto con imágenes
  createProductWithImages: async (
    token: string,
    productData: CreateProductData,
    images: File[]
  ) => {
    const formData = new FormData();

    // Agregar datos del producto
    Object.entries(productData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Agregar imágenes
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await axios.post(
      `${API_URL}/products/with-images`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  updateProduct: async (
    token: string,
    productId: string,
    productData: UpdateProductData
  ) => {
    const response = await axios.patch(
      `${API_URL}/products/${productId}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  deleteProduct: async (token: string, productId: string) => {
    const response = await axios.delete(`${API_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Funciones de manejo de imágenes
  uploadProductImage: async (token: string, productId: string, image: File) => {
    const formData = new FormData();
    formData.append('image', image);

    const response = await axios.post(
      `${API_URL}/products/${productId}/upload-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  uploadProductImages: async (
    token: string,
    productId: string,
    images: File[]
  ) => {
    const formData = new FormData();

    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await axios.post(
      `${API_URL}/products/${productId}/upload-images`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  removeProductImage: async (
    token: string,
    productId: string,
    imagePath: string
  ) => {
    const response = await axios.delete(
      `${API_URL}/products/${productId}/images`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          imagePath,
        },
      }
    );
    return response.data;
  },
};

export { productsApi };
