'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isActive: boolean;
  brand?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar productos al carrito');
      return;
    }

    if (product.stock === 0) {
      toast.error('Producto agotado');
      return;
    }

    try {
      await addToCart(product._id, 1);
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar a favoritos');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted
        ? `${product.name} eliminado de favoritos`
        : `${product.name} agregado a favoritos`
    );
  };

  const calculateDiscount = () => {
    if (!product.discountPrice) return 0;
    return Math.round(
      ((product.price - product.discountPrice) / product.price) * 100
    );
  };

  const discount = calculateDiscount();

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product._id}`}>
        <div className="card p-6 hover:shadow-large transition-all duration-300 group">
          <div className="flex space-x-6">
            {/* Product Image */}
            <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Image</span>
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2 space-y-1">
                {discount > 0 && (
                  <Badge variant="error" size="sm">
                    -{discount}%
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="error" size="sm">
                    Agotado
                  </Badge>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <Badge variant="warning" size="sm">
                    Poco Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {/* Category & Brand */}
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {product.category}
                    </span>
                    {product.brand && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500 font-medium">
                          {product.brand}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount} reseñas)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    {product.discountPrice ? (
                      <>
                        <span className="text-xl font-bold text-primary-600">
                          ${product.discountPrice.toFixed(2)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={handleWishlist}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isWishlisted
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? 'fill-current' : ''
                      }`}
                    />
                  </button>

                  <Link href={`/products/${product._id}`}>
                    <button
                      className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 flex items-center justify-center transition-all duration-200"
                      aria-label="Quick view"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || loading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <div
      className="group relative bg-white rounded-xl shadow-soft hover:shadow-large transition-all duration-500 overflow-hidden animate-fade-in-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product._id}`}>
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Product Image</span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-1">
            {discount > 0 && <Badge variant="error">-{discount}%</Badge>}
            {product.stock === 0 && <Badge variant="error">Agotado</Badge>}
            {product.stock > 0 && product.stock < 10 && (
              <Badge variant="warning">Solo {product.stock} disponibles</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isWishlisted
                ? 'bg-red-100 text-red-600'
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-red-100 hover:text-red-600'
            } ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            aria-label="Add to wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
            />
          </button>

          {/* Quick Actions */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex space-x-2">
              <button
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 hover:scale-110 transition-all duration-200"
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || loading}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
          {product.brand && (
            <span className="text-xs text-gray-500 font-medium">
              {product.brand}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          {product.discountPrice ? (
            <>
              <span className="text-lg font-bold text-primary-600">
                ${product.discountPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || loading}
          fullWidth
          size="sm"
          className="group-hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
        </Button>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-200 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
