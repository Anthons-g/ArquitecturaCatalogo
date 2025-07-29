'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Heart,
  Tag,
  Shield,
  Truck,
  Gift,
  Lock,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Validación para asegurar que itemId no sea undefined
    if (!itemId) {
      console.error('ItemId is undefined or null:', itemId);
      toast.error('Error: ID del artículo no válido');
      return;
    }

    console.log('Updating item:', itemId, 'to quantity:', newQuantity);
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
      // Error handled in context
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      // Error handled in context
    }
  };

  const calculateSubtotal = () => {
    return (
      cart?.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ) || 0
    );
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.1; // 10% tax
  };

  const calculateShipping = (subtotal: number) => {
    return subtotal > 100 ? 0 : 10; // Free shipping over $100
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="container-custom py-16">
          <div className="text-center max-w-md mx-auto animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Inicia sesión para ver tu carrito
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Por favor inicia sesión en tu cuenta para acceder a tu carrito de
              compras.
            </p>
            <div className="space-y-3">
              <Link href="/login" className="block">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg hover:scale-105">
                  Iniciar Sesión
                </button>
              </Link>
              <Link href="/register" className="block">
                <button className="w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm hover:scale-105">
                  Crear Cuenta
                </button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="container-custom py-16">
          <div className="flex flex-col items-center justify-center animate-fade-in-up">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando tu carrito...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <main className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Carrito de Compras</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            Mi Carrito de Compras
          </h1>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {cart?.totalItems || 0}{' '}
            {cart?.totalItems === 1 ? 'artículo' : 'artículos'}
          </div>
        </div>

        {!cart || cart.items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Parece que aún no has agregado ningún artículo a tu carrito.
              ¡Comienza a comprar para llenarlo!
            </p>
            <Link href="/products">
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg group hover:scale-105">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Continuar Comprando
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item) => {
                // Debug: Log item structure
                console.log('Cart item:', item);
                console.log('Item ID:', item._id);
                return (
                  <Card
                    key={item._id}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg overflow-hidden shadow-sm">
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-blue-400 text-xs font-medium">
                            Imagen
                          </span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {item.productId.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              {item.size && <span>Talla: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-blue-600">
                                ${item.price.toFixed(2)}
                              </span>
                              {item.productId.stock < 10 &&
                                item.productId.stock > 0 && (
                                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                    Solo quedan {item.productId.stock}
                                  </span>
                                )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Eliminar artículo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              aria-label="Agregar a favoritos"
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                updatingItems.has(item._id)
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <span className="w-12 text-center font-medium">
                              {updatingItems.has(item._id) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                              ) : (
                                item.quantity
                              )}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                item.quantity >= item.productId.stock ||
                                updatingItems.has(item._id)
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* Continue Shopping */}
              <div className="pt-4">
                <Link href="/products">
                  <button className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Continuar Comprando
                  </button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Resumen del Pedido
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Subtotal ({cart.totalItems}{' '}
                      {cart.totalItems === 1 ? 'artículo' : 'artículos'})
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">
                          Gratis
                        </span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Impuestos</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {shipping > 0 && (
                  <div className="mb-6 p-4 bg-rose-50 rounded-lg border border-rose-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Truck className="w-4 h-4 text-rose-600" />
                      <span className="text-sm font-medium text-rose-800">
                        ¡Agrega ${(100 - subtotal).toFixed(2)} más para envío
                        gratis!
                      </span>
                    </div>
                    <div className="w-full bg-rose-200 rounded-full h-2">
                      <div
                        className="bg-rose-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((subtotal / 100) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <Link href="/checkout">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-lg hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all shadow-lg group mb-4">
                    Proceder al Pago
                    <ArrowRight className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                {/* Security Features */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Pago 100% seguro</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>Envío gratis en pedidos +$100</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Gift className="w-4 h-4 text-purple-500" />
                    <span>Devoluciones gratuitas</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="text-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Lock className="w-4 h-4" />
                    <span>Checkout Seguro</span>
                  </div>
                  <p>Tu información de pago está protegida</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
