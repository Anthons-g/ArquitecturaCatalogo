'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Eye,
  X,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ordersApi, Order } from '@/lib/api/orders';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { token, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user-orders', page],
    queryFn: () => ordersApi.getUserOrders(token!, page, 10),
    enabled: !!token,
  });

  const handleCancelOrder = async (orderId: string) => {
    if (!token) return;

    setCancellingOrder(orderId);
    try {
      await ordersApi.cancelOrder(token, orderId);
      toast.success('Order cancelled successfully');
      refetch();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to cancel order';
      toast.error(message);
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-purple-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'processing':
        return 'secondary';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const canCancelOrder = (order: Order) => {
    return order.status === 'pending' || order.status === 'confirmed';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-16">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              Sign in to view your orders
            </h2>
            <p className="text-gray-600 mb-8">
              Please sign in to your account to access your order history.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">My Orders</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            My Orders
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load orders
            </h3>
            <p className="text-gray-600 mb-6">
              There was an error loading your orders. Please try again.
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : !data?.orders.length ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <Link href="/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Orders List */}
            <div className="space-y-6">
              {data.orders.map((order: Order) => (
                <Card key={order._id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <Badge
                          variant={getStatusColor(order.status) as any}
                          className="flex items-center space-x-1"
                        >
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          Placed on{' '}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                          {order.items.length}{' '}
                          {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link href={`/orders/${order._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>

                      {canCancelOrder(order) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelOrder(order._id)}
                          loading={cancellingOrder === order._id}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-400">IMG</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.productName}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}{' '}
                              {item.size && `• Size: ${item.size}`}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center text-sm text-gray-500">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Tracking Number: {order.trackingNumber}
                        </span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="secondary"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {page} of {data.pagination.pages}
                </span>

                <Button
                  variant="secondary"
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
