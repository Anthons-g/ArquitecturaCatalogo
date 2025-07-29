'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Truck,
  Shield,
  ArrowLeft,
  Check,
  Lock,
  Gift,
  Star,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ordersApi, CreateOrderData } from '@/lib/api/orders';
import { paymentsApi, ProcessPaymentData } from '@/lib/api/payments';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
  });

  const [paymentData, setPaymentData] = useState({
    method: 'credit_card' as 'credit_card' | 'paypal',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (!cart || cart.items.length === 0) {
    router.push('/cart');
    return null;
  }

  const subtotal = cart.totalAmount;
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sameAsShipping) {
      setPaymentData((prev) => ({
        ...prev,
        billingAddress: {
          street: shippingData.street,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: shippingData.country,
        },
      }));
    }
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create order
      const orderData: CreateOrderData = {
        shippingAddress: shippingData,
      };

      const order = await ordersApi.createOrder(token!, orderData);

      // Process payment
      const paymentRequestData: ProcessPaymentData = {
        orderId: order._id,
        method: paymentData.method,
        paymentDetails: {
          cardNumber: paymentData.cardNumber,
          expiryMonth: paymentData.expiryMonth,
          expiryYear: paymentData.expiryYear,
          cvv: paymentData.cvc,
          cardHolderName: paymentData.cardholderName,
          billingAddress: paymentData.billingAddress,
        },
      };

      const payment = await paymentsApi.processPayment(
        token!,
        paymentRequestData
      );

      if (payment.status === 'completed') {
        await clearCart();
        toast.success('¡Pedido realizado con éxito!');
        router.push(`/orders/${order._id}`);
      } else {
        toast.error('El pago falló. Por favor, inténtalo de nuevo.');
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Error al realizar el pedido';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Envío', icon: Truck },
    { number: 2, title: 'Pago', icon: CreditCard },
    { number: 3, title: 'Confirmación', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <main className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button
            onClick={() => router.back()}
            className="hover:text-blue-600 transition-colors flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Finalizar Compra</span>
        </nav>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Finalizar Compra
          </h1>
          <p className="text-sm md:text-base text-gray-600 px-4">
            Completa tu información para procesar tu pedido
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          {/* Desktop Version */}
          <div className="hidden md:flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 shadow-lg ${
                    currentStep >= step.number
                      ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    currentStep >= step.number
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-1 mx-6 rounded-full transition-all duration-300 ${
                      currentStep > step.number
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Version */}
          <div className="md:hidden">
            <div className="flex justify-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 shadow-lg mb-2 ${
                      currentStep >= step.number
                        ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                      currentStep >= step.number
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-5 w-8 h-0.5 transform translate-x-6 ${
                        currentStep > step.number
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Información de Envío */}
            {currentStep === 1 && (
              <Card className="p-4 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Información de Envío
                  </h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Nombre"
                      value={shippingData.firstName}
                      onChange={(e) =>
                        setShippingData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      label="Apellido"
                      value={shippingData.lastName}
                      onChange={(e) =>
                        setShippingData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <Input
                    label="Dirección"
                    value={shippingData.street}
                    onChange={(e) =>
                      setShippingData((prev) => ({
                        ...prev,
                        street: e.target.value,
                      }))
                    }
                    placeholder="Calle, número, apartamento"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Ciudad"
                      value={shippingData.city}
                      onChange={(e) =>
                        setShippingData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      label="Estado/Provincia"
                      value={shippingData.state}
                      onChange={(e) =>
                        setShippingData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Código Postal"
                      value={shippingData.zipCode}
                      onChange={(e) =>
                        setShippingData((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      label="Teléfono"
                      type="tel"
                      value={shippingData.phone}
                      onChange={(e) =>
                        setShippingData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg transform hover:scale-105"
                  >
                    Continuar al Pago
                  </button>
                </form>
              </Card>
            )}

            {/* Step 2: Información de Pago */}
            {currentStep === 2 && (
              <Card className="p-4 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Información de Pago
                  </h2>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Método de Pago */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Método de Pago
                    </label>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        {
                          value: 'credit_card',
                          label: 'Tarjeta de Crédito',
                          icon: '💳',
                          description: 'Visa, Mastercard, American Express',
                        },
                        {
                          value: 'paypal',
                          label: 'PayPal',
                          icon: '🅿️',
                          description: 'Paga con tu cuenta de PayPal',
                        },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            paymentData.method === method.value
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={paymentData.method === method.value}
                            onChange={(e) =>
                              setPaymentData((prev) => ({
                                ...prev,
                                method: e.target.value as any,
                              }))
                            }
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center">
                            <span className="mr-3 text-2xl">{method.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900">
                                {method.label}
                              </div>
                              <div className="text-sm text-gray-500">
                                {method.description}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Detalles de Tarjeta */}
                  {paymentData.method === 'credit_card' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Información de la Tarjeta
                      </h3>

                      <Input
                        label="Nombre del Titular"
                        value={paymentData.cardholderName}
                        onChange={(e) =>
                          setPaymentData((prev) => ({
                            ...prev,
                            cardholderName: e.target.value,
                          }))
                        }
                        placeholder="Como aparece en la tarjeta"
                        required
                      />

                      <Input
                        label="Número de Tarjeta"
                        value={paymentData.cardNumber}
                        onChange={(e) => {
                          // Format card number with spaces
                          const value = e.target.value
                            .replace(/\s/g, '')
                            .replace(/(.{4})/g, '$1 ')
                            .trim();
                          if (value.replace(/\s/g, '').length <= 16) {
                            setPaymentData((prev) => ({
                              ...prev,
                              cardNumber: value,
                            }));
                          }
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          label="Mes"
                          value={paymentData.expiryMonth}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (
                              value.length <= 2 &&
                              (value === '' ||
                                (parseInt(value) >= 1 && parseInt(value) <= 12))
                            ) {
                              setPaymentData((prev) => ({
                                ...prev,
                                expiryMonth: value,
                              }));
                            }
                          }}
                          placeholder="MM"
                          maxLength={2}
                          required
                        />
                        <Input
                          label="Año"
                          value={paymentData.expiryYear}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 2) {
                              setPaymentData((prev) => ({
                                ...prev,
                                expiryYear: value,
                              }));
                            }
                          }}
                          placeholder="AA"
                          maxLength={2}
                          required
                        />
                        <Input
                          label="CVV"
                          value={paymentData.cvc}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              setPaymentData((prev) => ({
                                ...prev,
                                cvc: value,
                              }));
                            }
                          }}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* PayPal Info */}
                  {paymentData.method === 'paypal' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🅿️</div>
                        <div>
                          <h3 className="font-medium text-blue-900">
                            Pago con PayPal
                          </h3>
                          <p className="text-sm text-blue-700">
                            Serás redirigido a PayPal para completar tu pago de
                            forma segura.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dirección de Facturación */}
                  <div>
                    <label className="flex items-center space-x-2 mb-4">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        La dirección de facturación es la misma que la de envío
                      </span>
                    </label>

                    {!sameAsShipping && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-4">
                          Dirección de Facturación
                        </h3>

                        <Input
                          label="Dirección"
                          value={paymentData.billingAddress.street}
                          onChange={(e) =>
                            setPaymentData((prev) => ({
                              ...prev,
                              billingAddress: {
                                ...prev.billingAddress,
                                street: e.target.value,
                              },
                            }))
                          }
                          placeholder="Calle, número, apartamento"
                          required
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Ciudad"
                            value={paymentData.billingAddress.city}
                            onChange={(e) =>
                              setPaymentData((prev) => ({
                                ...prev,
                                billingAddress: {
                                  ...prev.billingAddress,
                                  city: e.target.value,
                                },
                              }))
                            }
                            required
                          />
                          <Input
                            label="Estado/Provincia"
                            value={paymentData.billingAddress.state}
                            onChange={(e) =>
                              setPaymentData((prev) => ({
                                ...prev,
                                billingAddress: {
                                  ...prev.billingAddress,
                                  state: e.target.value,
                                },
                              }))
                            }
                            required
                          />
                        </div>
                        <Input
                          label="Código Postal"
                          value={paymentData.billingAddress.zipCode}
                          onChange={(e) =>
                            setPaymentData((prev) => ({
                              ...prev,
                              billingAddress: {
                                ...prev.billingAddress,
                                zipCode: e.target.value,
                              },
                            }))
                          }
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </div>
                      ) : (
                        'Realizar Pedido'
                      )}
                    </button>
                  </div>
                </form>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Resumen del Pedido
                </h2>
              </div>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-xs text-blue-400 font-medium">
                        IMG
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.productId.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Cant: {item.quantity}{' '}
                        {item.size && `• Talla: ${item.size}`}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Gratis</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Impuestos</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-blue-500" />
                  <span>Encriptación SSL</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Gift className="w-4 h-4 text-purple-500" />
                  <span>Garantía de satisfacción</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
