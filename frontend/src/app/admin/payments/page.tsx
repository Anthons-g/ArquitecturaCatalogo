'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { paymentsApi } from '@/lib/api/payments';
import {
  CreditCard,
  Search,
  Eye,
  ArrowLeft,
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface Payment {
  _id: string;
  paymentId: string;
  orderId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  currency: string;
  method: string;
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'refunded';
  transactionId?: string;
  gatewayResponse?: any;
  failureReason?: string;
  refundId?: string;
  refundAmount?: number;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PaymentsManagement() {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchPayments();
  }, [isAuthenticated, user, router]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      if (token) {
        const response = await paymentsApi.getUserPayments(token);
        setPayments(response.payments || response);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Datos de ejemplo como fallback
      setPayments([
        {
          _id: '1',
          paymentId: 'PAY-2024-001',
          orderId: 'ORD-2024-001',
          userId: {
            _id: '1',
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
          },
          amount: 59.98,
          currency: 'USD',
          method: 'credit_card',
          status: 'completed',
          transactionId: 'TXN-ABC123',
          processedAt: '2024-01-18T10:35:00Z',
          createdAt: '2024-01-18T10:30:00Z',
          updatedAt: '2024-01-18T10:35:00Z',
        },
        {
          _id: '2',
          paymentId: 'PAY-2024-002',
          orderId: 'ORD-2024-002',
          userId: {
            _id: '2',
            firstName: 'María',
            lastName: 'García',
            email: 'maria@example.com',
          },
          amount: 79.99,
          currency: 'USD',
          method: 'paypal',
          status: 'completed',
          transactionId: 'TXN-DEF456',
          processedAt: '2024-01-17T14:25:00Z',
          createdAt: '2024-01-17T14:20:00Z',
          updatedAt: '2024-01-17T14:25:00Z',
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
    { value: 'completed', label: 'Completado' },
    { value: 'failed', label: 'Fallido' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'refunded', label: 'Reembolsado' },
  ];

  const methodOptions = [
    { value: 'all', label: 'Todos los métodos' },
    { value: 'credit_card', label: 'Tarjeta de Crédito' },
    { value: 'debit_card', label: 'Tarjeta de Débito' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'bank_transfer', label: 'Transferencia' },
  ];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userId.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.userId.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.transactionId &&
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod =
      methodFilter === 'all' || payment.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'debit_card':
        return 'Tarjeta de Débito';
      case 'paypal':
        return 'PayPal';
      case 'stripe':
        return 'Stripe';
      case 'bank_transfer':
        return 'Transferencia';
      default:
        return method;
    }
  };

  const handleRefund = async (paymentId: string) => {
    if (!confirm('¿Estás seguro de que quieres procesar el reembolso?')) {
      return;
    }

    try {
      if (token) {
        //  await paymentsApi.processPayment(token, paymentId);
      }
      setPayments(
        payments.map((payment) =>
          payment._id === paymentId
            ? { ...payment, status: 'refunded' as any }
            : payment
        )
      );
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Error al procesar el reembolso');
    }
  };

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const todayRevenue = payments
    .filter(
      (p) =>
        p.status === 'completed' &&
        new Date(p.createdAt).toDateString() === new Date().toDateString()
    )
    .reduce((sum, payment) => sum + payment.amount, 0);

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
                Gestión de Pagos
              </h1>
              <p className="text-slate-600">Administra pagos y transacciones</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Pagos
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {payments.length}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Completados
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {payments.filter((p) => p.status === 'completed').length}
                </p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Fallidos</p>
                <p className="text-2xl font-bold text-red-600">
                  {payments.filter((p) => p.status === 'failed').length}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Ingresos Totales
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Ingresos Hoy
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ${todayRevenue.toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
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
                placeholder="Buscar pagos..."
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
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {methodOptions.map((option) => (
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

        {/* Payments Table */}
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    ID Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Estado
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
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-slate-500"
                    >
                      No se encontraron pagos
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.paymentId}
                        </div>
                        {payment.transactionId && (
                          <div className="text-xs text-gray-500">
                            TXN: {payment.transactionId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.userId.firstName} {payment.userId.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.userId.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.orderId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${payment.amount.toFixed(2)} {payment.currency}
                        </div>
                        {payment.refundAmount && (
                          <div className="text-xs text-red-600">
                            Reembolso: ${payment.refundAmount.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getMethodLabel(payment.method)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">
                            {payment.status === 'completed'
                              ? 'Completado'
                              : payment.status === 'pending'
                              ? 'Pendiente'
                              : payment.status === 'processing'
                              ? 'Procesando'
                              : payment.status === 'failed'
                              ? 'Fallido'
                              : payment.status === 'cancelled'
                              ? 'Cancelado'
                              : payment.status === 'refunded'
                              ? 'Reembolsado'
                              : payment.status}
                          </span>
                        </span>
                        {payment.failureReason && (
                          <div className="text-xs text-red-600 mt-1">
                            {payment.failureReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs">
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          {payment.status === 'completed' && (
                            <button
                              onClick={() => handleRefund(payment._id)}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded"
                              title="Procesar reembolso"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
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
