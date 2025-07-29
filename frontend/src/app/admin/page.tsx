'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { usersApi } from '@/lib/api/users';
import { productsApi } from '@/lib/api/products';
import {
  Users,
  Package,
  CreditCard,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Settings,
  BarChart3,
  Shield,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    recentUsers: [],
    recentProducts: [],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, user, router]);

  const loadDashboardData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Cargar datos de usuarios
      const usersResponse = await usersApi.getAllUsers(token, 1, 5);

      // Cargar datos de productos
      const productsResponse = await productsApi.getProducts({
        limit: 5,
        page: 1,
      });

      setDashboardData({
        totalUsers: usersResponse.pagination?.total || 0,
        totalProducts: productsResponse.pagination?.total || 0,
        recentUsers: usersResponse.users || [],
        recentProducts: productsResponse.products || [],
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error al cargar los datos del panel');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const adminModules = [
    {
      title: 'Usuarios',
      description: 'Gestionar usuarios y permisos',
      icon: Users,
      href: '/admin/users',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Productos',
      description: 'Administrar catálogo de productos',
      icon: Package,
      href: '/admin/products',
      color: 'from-purple-600 to-violet-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Pedidos',
      description: 'Gestionar pedidos y entregas',
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'from-indigo-600 to-blue-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Pagos',
      description: 'Administrar transacciones',
      icon: CreditCard,
      href: '/admin/payments',
      color: 'from-violet-600 to-purple-600',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
  ];

  const quickStats = [
    {
      title: 'Ventas del Mes',
      value: '$24,580',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: 'up',
    },
    {
      title: 'Pedidos Activos',
      value: '47',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up',
    },
    {
      title: 'Usuarios Totales',
      value: loading ? '...' : dashboardData.totalUsers.toString(),
      change: '+15.3%',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up',
    },
    {
      title: 'Productos',
      value: loading ? '...' : dashboardData.totalProducts.toString(),
      change: '+3.1%',
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      trend: 'up',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="container-custom py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Panel de Administración
              </h1>
              <p className="text-slate-600">
                Bienvenido, {user?.firstName}. Gestiona tu plataforma desde
                aquí.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              className={`p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up border-slate-200/50 bg-white/80 backdrop-blur-sm`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <p className={`text-sm ${stat.color} font-medium`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} shadow-sm`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {adminModules.map((module, index) => (
            <Link key={index} href={module.href}>
              <Card
                className={`p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group border-slate-200/50 bg-white/80 backdrop-blur-sm animate-fade-in-up`}
                style={{ animationDelay: `${(index + 4) * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-xl ${module.bgColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <module.icon className={`w-6 h-6 ${module.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Data Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card
            className="p-6 border-slate-200/50 bg-white/80 backdrop-blur-sm animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Usuarios Recientes
                </h2>
              </div>
              <Link
                href="/admin/users"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Ver todos
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="sm" />
              </div>
            ) : dashboardData.recentUsers.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentUsers
                  .slice(0, 4)
                  .map((user: any, index: number) => (
                    <div
                      key={user.id || index}
                      className="flex items-center space-x-3 p-3 bg-slate-50/50 rounded-lg hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {user.firstName?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.role === 'admin' ? 'Admin' : 'Cliente'}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">
                  No hay usuarios para mostrar
                </p>
              </div>
            )}
          </Card>

          {/* Recent Products */}
          <Card
            className="p-6 border-slate-200/50 bg-white/80 backdrop-blur-sm animate-fade-in-up"
            style={{ animationDelay: '0.9s' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Productos Recientes
                </h2>
              </div>
              <Link
                href="/admin/products"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Ver todos
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="sm" />
              </div>
            ) : dashboardData.recentProducts.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentProducts
                  .slice(0, 4)
                  .map((product: any, index: number) => (
                    <div
                      key={product._id || index}
                      className="flex items-center space-x-3 p-3 bg-slate-50/50 rounded-lg hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-600 capitalize">
                          {product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          ${product.price?.toFixed(2)}
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            product.stock > 10
                              ? 'text-emerald-600'
                              : product.stock > 0
                              ? 'text-orange-600'
                              : 'text-red-600'
                          }`}
                        >
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">
                  No hay productos para mostrar
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* System Status */}
        <div className="mt-6">
          <Card
            className="p-6 border-slate-200/50 bg-white/80 backdrop-blur-sm animate-fade-in-up"
            style={{ animationDelay: '1.0s' }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Estado del Sistema
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: 'Servidor Web',
                  status: 'Operativo',
                  color: 'bg-emerald-500',
                },
                {
                  name: 'Base de Datos',
                  status: 'Operativo',
                  color: 'bg-emerald-500',
                },
                { name: 'API', status: 'Operativo', color: 'bg-emerald-500' },
                {
                  name: 'Servicios',
                  status: 'Operativo',
                  color: 'bg-emerald-500',
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${service.color}`}
                    ></div>
                    <span className="text-sm font-medium text-slate-900">
                      {service.name}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

    </div>
  );
}
