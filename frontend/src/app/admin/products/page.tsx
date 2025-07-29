'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import {
  productsApi,
  CreateProductData,
  UpdateProductData,
} from '@/lib/api/products';
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Filter,
  Star,
  TrendingUp,
  AlertTriangle,
  X,
  Upload,
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  images: string[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export default function ProductsManagement() {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    featured: false,
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, user, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      if (token) {
        const response = await productsApi.getProducts();
        setProducts(response.products || response);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Datos de ejemplo como fallback
      setProducts([
        {
          _id: '1',
          name: 'Camiseta Básica',
          description: 'Camiseta de algodón 100% premium',
          price: 29.99,
          discountPrice: 24.99,
          category: 'shirts',
          stock: 150,
          images: ['/placeholder-product.jpg'],
          isActive: true,
          rating: 4.5,
          reviewCount: 23,
          createdAt: '2024-01-15T10:30:00Z',
        },
        {
          _id: '2',
          name: 'Jeans Clásicos',
          description: 'Jeans de corte clásico, cómodos y duraderos',
          price: 79.99,
          category: 'pants',
          stock: 5,
          images: ['/placeholder-product.jpg'],
          isActive: true,
          rating: 4.2,
          reviewCount: 45,
          createdAt: '2024-01-10T09:15:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'shirts', label: 'Camisetas' },
    { value: 'pants', label: 'Pantalones' },
    { value: 'dresses', label: 'Vestidos' },
    { value: 'shoes', label: 'Zapatos' },
    { value: 'accessories', label: 'Accesorios' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && product.isActive) ||
      (statusFilter === 'inactive' && !product.isActive);

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && product.stock > 0 && product.stock <= 10) ||
      (stockFilter === 'out' && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  const handleCreateProduct = async () => {
    try {
      if (!token) return;

      if (selectedImages.length > 0) {
        const response = await productsApi.createProductWithImages(
          token,
          formData,
          selectedImages
        );
        setProducts([...products, response.product]);
      } else {
        const response = await productsApi.createProduct(token, formData);
        setProducts([...products, response.product || response]);
      }

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    }
  };

  const handleUpdateProduct = async () => {
    try {
      if (!token || !selectedProduct) return;

      const response = await productsApi.updateProduct(
        token,
        selectedProduct._id,
        formData
      );
      setProducts(
        products.map((p) =>
          p._id === selectedProduct._id ? { ...p, ...response.product } : p
        )
      );

      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      if (token) {
        await productsApi.deleteProduct(token, productId);
      }
      setProducts(products.filter((p) => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleToggleStatus = async (productId: string) => {
    try {
      setProducts(
        products.map((p) =>
          p._id === productId ? { ...p, isActive: !p.isActive } : p
        )
      );
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      featured: false,
    });
    setSelectedImages([]);
    setSelectedProduct(null);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      featured: false,
    });
    setShowEditModal(true);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { text: 'Agotado', color: 'bg-red-100 text-red-800' };
    if (stock <= 10)
      return { text: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'En Stock', color: 'bg-green-100 text-green-800' };
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Gestión de Productos
              </h1>
              <p className="text-slate-600">
                Administra tu catálogo de productos
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Producto
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Productos
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {products.length}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Productos Activos
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {products.filter((p) => p.isActive).length}
                </p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-orange-600">
                  {products.filter((p) => p.stock > 0 && p.stock <= 10).length}
                </p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Agotados</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter((p) => p.stock === 0).length}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="all">Todo el stock</option>
              <option value="low">Stock bajo</option>
              <option value="out">Agotados</option>
            </select>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
              <Filter className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-blue-600">Filtros</span>
            </button>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </Card>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    {!product.isActive && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        Inactivo
                      </span>
                    )}
                    {product.discountPrice && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        Oferta
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {product.discountPrice ? (
                        <>
                          <span className="text-lg font-bold text-green-600">
                            ${product.discountPrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        getStockStatus(product.stock).color
                      }`}
                    >
                      {getStockStatus(product.stock).text}
                    </span>
                    <span className="text-sm text-gray-600">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(product._id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        product.isActive
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {product.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Crear Producto
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="shirts">Camisetas</option>
                  <option value="pants">Pantalones</option>
                  <option value="dresses">Vestidos</option>
                  <option value="shoes">Zapatos</option>
                  <option value="accessories">Accesorios</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Imágenes
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedImages(Array.from(e.target.files || []))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-slate-700">
                  Producto destacado
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProduct}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Editar Producto
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="shirts">Camisetas</option>
                  <option value="pants">Pantalones</option>
                  <option value="dresses">Vestidos</option>
                  <option value="shoes">Zapatos</option>
                  <option value="accessories">Accesorios</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-slate-700">
                  Producto destacado
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
