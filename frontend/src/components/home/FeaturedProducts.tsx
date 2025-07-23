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
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (productId: string, productName: string) => {
    if (!isAuthenticated) {
      toast.error('Por favor inicia sesión para agregar productos al carrito');
      return;
    }

    try {
      await addToCart(productId, 1);
      toast.success(`¡${productName} agregado al carrito!`);
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleWishlist = (productId: string, productName: string) => {
    if (!isAuthenticated) {
      toast.error('Por favor inicia sesión para agregar productos a favoritos');
      return;
    }

    // TODO: Implement wishlist functionality
    toast.success(`¡${productName} agregado a favoritos!`);
  };

  const calculateDiscount = (price: number, discountPrice: number) => {
    return Math.round(((price - discountPrice) / price) * 100);
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4 shadow-xl">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
        <p className="text-slate-600 text-lg">
          No hay productos destacados disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, index) => (
        <div
          key={product._id}
          className="group relative bg-white/90 rounded-2xl shadow-blue hover:shadow-blue-lg transition-all duration-500 overflow-hidden border border-blue-200/50 hover:scale-[1.02] hover:bg-blue-50/40 animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
          onMouseEnter={() => setHoveredProduct(product._id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            {/* Placeholder for product image */}
            <div className="w-full h-full bg-gradient-to-br from-blue-100/50 to-indigo-100/50 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="w-12 h-12 text-blue-400/50 mx-auto mb-2" />
                <span className="text-blue-500/70 text-sm font-medium">
                  Imagen del Producto
                </span>
              </div>
            </div>

            {/* Discount Badge */}
            {product.discountPrice && (
              <div className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-bold">
                -{calculateDiscount(product.price, product.discountPrice)}%
              </div>
            )}

            {/* Stock Badge */}
            {product.stock < 10 && product.stock > 0 && (
              <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Solo {product.stock} disponibles
              </div>
            )}

            {/* Out of Stock Badge */}
            {product.stock === 0 && (
              <div className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-bold">
                Agotado
              </div>
            )}

            {/* Hover Actions */}
            <div
              className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 ${
                hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex space-x-3">
                <button
                  onClick={() => handleWishlist(product._id, product.name)}
                  className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-blue-500 hover:scale-110 transition-all duration-200 shadow-lg"
                  aria-label="Agregar a favoritos"
                >
                  <Heart className="w-5 h-5" />
                </button>

                <Link
                  href={`/products/${product._id}`}
                  className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-500 hover:scale-110 transition-all duration-200 shadow-lg"
                  aria-label="Vista rápida"
                >
                  <Eye className="w-5 h-5" />
                </Link>

                <button
                  onClick={() => handleAddToCart(product._id, product.name)}
                  disabled={product.stock === 0 || loading}
                  className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-purple-500 hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  aria-label="Agregar al carrito"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 sm:p-6">
            {/* Category */}
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">
              {product.category}
            </p>

            {/* Product Name */}
            <Link href={`/products/${product._id}`}>
              <h3 className="font-bold text-slate-700 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 text-base sm:text-lg leading-tight">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-amber-400 fill-current'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500 font-medium">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-4">
              {product.discountPrice ? (
                <>
                  <span className="text-xl font-bold text-blue-600">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-slate-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-slate-700">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={() => handleAddToCart(product._id, product.name)}
              disabled={product.stock === 0 || loading}
              className="w-full group-hover:scale-105 transition-transform duration-200 font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue"
              size="sm"
            >
              {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
            </Button>
          </div>

          {/* Hover Effect Border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300/40 transition-all duration-300 pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
