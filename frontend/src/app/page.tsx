'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  Truck,
  Shield,
  Heart,
  Star,
  Zap,
  Award,
  Users,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getFeaturedProducts(8),
  });

  const stats = [
    { icon: Users, number: '50K+', label: 'Clientes Felices' },
    { icon: ShoppingBag, number: '100K+', label: 'Productos Vendidos' },
    { icon: Award, number: '4.9', label: 'Calificación Promedio' },
    { icon: TrendingUp, number: '99%', label: 'Satisfacción' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <main className="relative">
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        <section className="py-12 md:py-16 bg-white/80 backdrop-blur-sm border-y border-blue-200/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30 relative">
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6 shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-6">
                Productos Destacados
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Descubre nuestra selección curada de productos premium que
                nuestros clientes más aman
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 md:py-20">
                <LoadingSpinner size="lg" />
                <p className="text-gray-500 mt-4 text-lg">
                  Cargando productos increíbles...
                </p>
              </div>
            ) : (
              <div
                className="relative animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                <FeaturedProducts products={featuredProducts || []} />

                {/* Gradient Overlay for Visual Appeal */}
                <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-blue-200/5 to-transparent rounded-3xl pointer-events-none" />
              </div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/20 border-t border-blue-200/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-4">
                ¿Por Qué Elegirnos?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ofrecemos la mejor experiencia de compra con servicios
                excepcionales y atención personalizada
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-200/50 hover:shadow-xl hover:bg-blue-50/30 transition-all duration-500 hover:scale-105 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Envío Gratuito
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  En pedidos superiores a $50. Entrega rápida y segura
                  directamente a tu puerta con seguimiento en tiempo real.
                </p>
              </div>

              <div
                className="text-center group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-200/50 hover:shadow-xl hover:bg-blue-50/30 transition-all duration-500 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Compra Segura
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Protección total de datos y transacciones 100% seguras
                  garantizadas con encriptación de nivel bancario.
                </p>
              </div>

              <div
                className="text-center group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-200/50 hover:shadow-xl hover:bg-blue-50/30 transition-all duration-500 hover:scale-105 animate-fade-in-up sm:col-span-2 lg:col-span-1"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Soporte 24/7
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Atención al cliente excepcional disponible las 24 horas cuando
                  lo necesites, siempre listos para ayudarte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¡No Te Pierdas Nuestras Ofertas!
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Suscríbete a nuestro newsletter y recibe descuentos exclusivos,
                nuevos productos y tendencias de moda.
              </p>

              <div className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="flex-1 px-4 py-3 rounded-lg border-0 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  />
                  <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg">
                    Suscribirse
                  </button>
                </div>
                <p className="text-sm text-blue-200 mt-3">
                  * No spam, solo ofertas increíbles y novedades
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
