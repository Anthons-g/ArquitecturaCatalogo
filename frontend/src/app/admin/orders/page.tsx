'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { ordersApi } from '@/lib/api/orders';
import {
  ShoppingCart,
  Search,
  Eye,
  ArrowLeft,
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    productId: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function OrdersManagement() {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, user, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (token) {
        const response = await ordersApi.getUserOrders(token);
        setOrders(response.orders || response);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Datos de ejemplo como fallback
      setOrders([
        {
          _id: '1',
          orderNumber: 'ORD-2024-001',
          userId: {
            _id: '1',
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
          },
          items: [
            {
              productId: {
                _id: '1',
                name: 'Camiseta Básica',
                price: 29.99,
              },
              quantity: 2,
              price: 29.99,
            },
          ],
          totalAmount: 59.98,
          status: 'processing',
          paymentStatus: 'completed',
          shippingAddress: {
            street: 'Calle Principal 123',
            city: 'Madrid',
            state: 'Madrid',
            zipCode: '28001',
            country: 'España',
          },
          createdAt: '2024-01-18T10:30:00Z',
          updatedAt: '2024-01-18T11:00:00Z',
        },
        {
          _id: '2',
          orderNumber: 'ORD-2024-002',
          userId: {
            _id: '2',
            firstName: 'María',
            lastName: 'García',
            email: 'maria@example.com',
          },
          items: [
            {
              productId: {
                _id: '2',
                name: 'Jeans Clásicos',
                price: 79.99,
              },
              quantity: 1,
              price: 79.99,
            },
          ],
          totalAmount: 79.99,
          status: 'shipped',
          paymentStatus: 'completed',
          shippingAddress: {
            street: 'Avenida Central 456',
            city: 'Barcelona',
            state: 'Cataluña',
            zipCode: '08001',
            country: 'España',
          },
          createdAt: '2024-01-17T14:20:00Z',
          updatedAt: '2024-01-18T09:15:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'processing', label: 'Procesando' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  const paymentOptions = [
    { value: 'all', label: 'Todos los pagos' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'completed', label: 'Completado' },
    { value: 'failed', label: 'Fallido' },
    { value: 'refunded', label: 'Reembolsado' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === 'all' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // Aquí se haría la llamada a la API para actualizar el estado
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus as any } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado del pedido');
    }
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
              <button className="p-2 hover:bg-white/80 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Gestión de Pedidos
              </h1>
              <p className="text-slate-600">
                Administra todos los pedidos de la tienda
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Pedidos
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.length}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">
                  {orders.filter((o) => o.status === 'pending').length}
                </p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Procesando</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter((o) => o.status === 'processing').length}
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
                <p className="text-sm font-medium text-slate-600">Enviados</p>
                <p className="text-2xl font-bold text-purple-600">
                  {orders.filter((o) => o.status === 'shipped').length}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ventas Hoy</p>
                <p className="text-2xl font-bold text-emerald-600">
                  $
                  {orders
                    .reduce((sum, order) => sum + order.totalAmount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {paymentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
              <Filter className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-blue-600">Filtros</span>
            </button>
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-slate-500"
                    >
                      No se encontraron pedidos
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {order.userId.firstName} {order.userId.lastName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {order.userId.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">
                          {order.items.map((item, index) => (
                            <div key={index}>
                              {item.productId.name} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">
                            {order.status === 'pending'
                              ? 'Pendiente'
                              : order.status === 'processing'
                              ? 'Procesando'
                              : order.status === 'shipped'
                              ? 'Enviado'
                              : order.status === 'delivered'
                              ? 'Entregado'
                              : order.status === 'cancelled'
                              ? 'Cancelado'
                              : order.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus === 'completed'
                            ? 'Completado'
                            : order.paymentStatus === 'pending'
                            ? 'Pendiente'
                            : order.paymentStatus === 'failed'
                            ? 'Fallido'
                            : 'Reembolsado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateStatus(order._id, e.target.value)
                            }
                            className="text-xs border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="processing">Procesando</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
