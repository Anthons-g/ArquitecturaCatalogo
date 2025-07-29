'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Share2,
  Plus,
  Minus,
  CheckCircle,
} from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => productsApi.getProduct(params.id),
  });

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar productos al carrito');
      return;
    }

    if (!product) return;

    if (product.availableSizes?.length > 0 && !selectedSize) {
      toast.error('Por favor selecciona una talla');
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      toast.error('Por favor selecciona un color');
      return;
    }

    if (product.stock < quantity) {
      toast.error('No hay suficiente stock disponible');
      return;
    }

    try {
      await addToCart(product._id, quantity, selectedSize, selectedColor);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar a favoritos');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted
        ? `${product?.name} eliminado de favoritos`
        : `${product?.name} agregado a favoritos`
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('¡Enlace del producto copiado al portapapeles!');
    }
  };

  const calculateDiscount = () => {
    if (!product?.discountPrice) return 0;
    return Math.round(
      ((product.price - product.discountPrice) / product.price) * 100
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="container-custom py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Producto no encontrado
            </h2>
            <p className="text-slate-600 mb-8">
              El producto que buscas no existe o ha sido eliminado.
            </p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Ver Productos
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = calculateDiscount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-blue-600 transition-colors"
          >
            Productos
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium capitalize">
            {product.category}
          </span>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Productos
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-slate-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {activeImageIndex + 1}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    Imagen del Producto
                  </p>
                  <p className="text-sm text-slate-400">
                    Vista Previa de Alta Calidad
                  </p>
                </div>
              </div>

              {/* Image Overlay Effects */}
              <div className="absolute top-4 right-4 flex space-x-2">
                {discount > 0 && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{discount}% DESC
                  </div>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Poco Stock
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-square bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                      activeImageIndex === index
                        ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-slate-500 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="capitalize bg-blue-100 text-blue-800 border-blue-200"
                  >
                    {product.category}
                  </Badge>
                  {product.brand && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 border-purple-200"
                    >
                      {product.brand}
                    </Badge>
                  )}
                  {discount > 0 && (
                    <Badge
                      variant="error"
                      className="bg-red-100 text-red-800 border-red-200 animate-pulse"
                    >
                      -{discount}% DESC
                    </Badge>
                  )}
                </div>

                {product.stock === 0 ? (
                  <Badge variant="error" className="bg-red-100 text-red-800">
                    Agotado
                  </Badge>
                ) : product.stock < 10 ? (
                  <Badge
                    variant="warning"
                    className="bg-orange-100 text-orange-800"
                  >
                    Poco Stock
                  </Badge>
                ) : (
                  <Badge
                    variant="success"
                    className="bg-green-100 text-green-800"
                  >
                    Disponible
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-slate-900">
                      {product.rating}
                    </span>
                    <span className="text-slate-600">
                      {' '}
                      ({product.reviewCount} reseñas)
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Producto Verificado</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {product.discountPrice ? (
                      <>
                        <span className="text-3xl font-bold text-blue-600">
                          ${product.discountPrice.toFixed(2)}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-lg text-slate-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            Ahorras $
                            {(product.price - product.discountPrice).toFixed(2)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-slate-900">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="text-right">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {discount}% DESC
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Tiempo Limitado
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Options */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Opciones del Producto
              </h3>

              {/* Size Selection */}
              {product.availableSizes?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-3">
                    Talla{' '}
                    {selectedSize && (
                      <span className="text-blue-600 font-semibold">
                        ({selectedSize})
                      </span>
                    )}
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {product.availableSizes.map((size: any) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-3 text-sm font-medium border rounded-xl transition-all duration-300 ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                            : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:scale-105'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-3">
                    Color{' '}
                    {selectedColor && (
                      <span className="text-blue-600 capitalize font-semibold">
                        ({selectedColor})
                      </span>
                    )}
                  </label>
                  <div className="flex space-x-3">
                    {product.colors.map((color: any) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-3 transition-all duration-300 shadow-md hover:shadow-lg ${
                          selectedColor === color
                            ? 'border-blue-500 scale-110 ring-2 ring-blue-200'
                            : 'border-slate-300 hover:border-slate-400 hover:scale-105'
                        }`}
                        style={{
                          backgroundColor:
                            color === 'white' ? '#ffffff' : color,
                        }}
                        title={color}
                      >
                        {color === 'white' && (
                          <div className="w-full h-full border border-slate-200 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  Cantidad
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="bg-slate-50 rounded-xl px-6 py-3 min-w-[80px] text-center">
                    <span className="font-bold text-xl text-slate-900">
                      {quantity}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {product.stock < 10 && product.stock > 0 && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-700 font-medium">
                      ¡Solo quedan {product.stock} en stock - Ordena pronto!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 space-y-6">
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || cartLoading}
                  loading={cartLoading}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  size="lg"
                  className={`hover:scale-105 transition-all duration-200 ${
                    isWishlisted
                      ? 'text-red-600 border-red-300 bg-red-50 hover:bg-red-100'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                  />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  size="lg"
                  className="hover:scale-105 transition-all duration-200 hover:bg-slate-50"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-green-800">
                      Envío Gratis
                    </div>
                    <div className="text-xs text-green-600">
                      Pedidos sobre $50
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-800">
                      Devoluciones Fáciles
                    </div>
                    <div className="text-xs text-blue-600">
                      Política de 30 días
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-800">
                      Pago Seguro
                    </div>
                    <div className="text-xs text-purple-600">SSL Protegido</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Detalles del Producto
              </h3>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="font-medium text-slate-900 mb-2">
                    Descripción
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">
                          #
                        </span>
                      </div>
                      <span className="font-medium text-blue-900">
                        Información del Producto
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">SKU:</span>
                        <span className="font-medium text-blue-900">
                          {product.sku}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Categoría:</span>
                        <span className="font-medium text-blue-900 capitalize">
                          {product.category}
                        </span>
                      </div>
                      {product.material && (
                        <div className="flex justify-between">
                          <span className="text-blue-700">Material:</span>
                          <span className="font-medium text-blue-900">
                            {product.material}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="font-medium text-green-900">
                        Disponibilidad
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Stock:</span>
                        <span className="font-medium text-green-900">
                          {product.stock} disponibles
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Estado:</span>
                        <span
                          className={`font-medium ${
                            product.stock > 0
                              ? 'text-green-900'
                              : 'text-red-600'
                          }`}
                        >
                          {product.stock > 0 ? 'Disponible' : 'Agotado'}
                        </span>
                      </div>
                      {product.brand && (
                        <div className="flex justify-between">
                          <span className="text-green-700">Marca:</span>
                          <span className="font-medium text-green-900">
                            {product.brand}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-purple-600" />
                      </div>
                      <span className="font-medium text-purple-900">
                        Etiquetas del Producto
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag: any) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          size="sm"
                          className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
