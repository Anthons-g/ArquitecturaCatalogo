'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  CreditCard,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ordersApi, Order } from '@/lib/api/orders';
import { paymentsApi } from '@/lib/api/payments';
import React from 'react';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { token, isAuthenticated } = useAuth();

  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ['order', params.id],
    queryFn: () => ordersApi.getOrder(token!, params.id),
    enabled: !!token,
  });

  const { data: payment, isLoading: paymentLoading } = useQuery({
    queryKey: ['payment', params.id],
    queryFn: () => paymentsApi.getPaymentByOrder(token!, params.id),
    enabled: !!token && !!order,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
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

  const getOrderProgress = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Package },
      { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
      { key: 'processing', label: 'Processing', icon: Clock },
      { key: 'shipped', label: 'Shipped', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const currentIndex = steps.findIndex((step) => step.key === status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-16">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              Sign in to view order details
            </h2>
            <p className="text-gray-600 mb-8">
              Please sign in to your account to access order information.
            </p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-16">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              Order not found
            </h2>
            <p className="text-gray-600 mb-8">
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Link href="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progressSteps = getOrderProgress(order.status);

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
          <Link
            href="/orders"
            className="hover:text-primary-600 transition-colors"
          >
            Orders
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            #{order.orderNumber}
          </span>
        </nav>

        {/* Back Button */}
        <Link
          href="/orders"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Order #{order.orderNumber}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>
                Placed on {new Date(order.createdAt).toLocaleDateString()}
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

          <div className="mt-4 lg:mt-0">
            <Badge
              variant={getStatusColor(order.status) as any}
              className="flex items-center space-x-2 text-base px-4 py-2"
            >
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress */}
            {order.status !== 'cancelled' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Progress
                </h2>
                <div className="space-y-4">
                  {progressSteps.map((step, index) => (
                    <div key={step.key} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          step.completed
                            ? 'border-primary-600 bg-primary-600 text-white'
                            : 'border-gray-300 text-gray-400'
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p
                          className={`font-medium ${
                            step.completed ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.current && (
                          <p className="text-sm text-primary-600">
                            Current status
                          </p>
                        )}
                      </div>
                      {index < progressSteps.length - 1 && (
                        <div
                          className={`absolute left-5 mt-10 w-0.5 h-8 ${
                            step.completed ? 'bg-primary-600' : 'bg-gray-300'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-400">IMG</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Quantity: {item.quantity}</span>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.unitPrice.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Tracking Information
                </h2>
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Tracking Number</p>
                    <p className="text-blue-700">{order.trackingNumber}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {order.shippingCost === 0
                      ? 'Free'
                      : `$${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h2>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.firstName}{' '}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="mt-2">{order.shippingAddress.phone}</p>
                )}
              </div>
            </Card>

            {/* Payment Information */}
            {payment && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-mono text-sm">
                      {payment.paymentId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="capitalize">
                      {payment.method.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge
                      variant={
                        payment.status === 'completed'
                          ? 'success'
                          : payment.status === 'failed'
                          ? 'error'
                          : 'warning'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                  {payment.processedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processed</span>
                      <span className="text-sm">
                        {new Date(payment.processedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
