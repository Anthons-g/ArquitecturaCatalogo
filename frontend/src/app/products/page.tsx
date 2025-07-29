'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
  Sparkles,
  ShoppingBag,
  Truck,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { productsApi, ProductFilters } from '@/lib/api/products';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProductCardSkeleton } from '@/components/ui/LoadingSpinner';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFiltersPanel } from '@/components/products/ProductFiltersPanel';

const ITEMS_PER_PAGE = 20;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters: ProductFilters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: ITEMS_PER_PAGE,
      category: searchParams.get('category') || undefined,
      gender: searchParams.get('gender') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice')
        ? parseFloat(searchParams.get('minPrice')!)
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? parseFloat(searchParams.get('maxPrice')!)
        : undefined,
      size: searchParams.get('size') || undefined,
      color: searchParams.get('color') || undefined,
      brand: searchParams.get('brand') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };
    setFilters(urlFilters);
  }, [searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
  });

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: ITEMS_PER_PAGE,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.gender) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.size) count++;
    if (filters.color) count++;
    if (filters.brand) count++;
    if (filters.search) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container-custom py-16 relative">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Descubre Productos Increíbles
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {filters.search
                ? `Resultados para "${filters.search}"`
                : 'Colección Premium'}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Explora nuestra selección curada de productos de alta calidad
              diseñados para el estilo de vida moderno
            </p>
          </div>
        </div>
      </div>

      <main className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8 animate-fade-in-up">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Productos</span>
        </nav>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mb-3 shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {data?.pagination?.total || 0}
            </div>
            <div className="text-sm text-blue-600 font-medium">Productos</div>
          </Card>
          <Card
            className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mb-3 shadow-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-900 mb-1">Gratis</div>
            <div className="text-sm text-green-600 font-medium">Envío</div>
          </Card>
          <Card
            className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl mb-3 shadow-lg">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-900 mb-1">30</div>
            <div className="text-sm text-purple-600 font-medium">
              Días Devolución
            </div>
          </Card>
          <Card
            className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl mb-3 shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-900 mb-1">24/7</div>
            <div className="text-sm text-orange-600 font-medium">Soporte</div>
          </Card>
        </div>

        {/* Search and Filters Header */}
        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/30 p-6 mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={filters.search || ''}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className="pl-10 bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {data && (
                <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                  <span className="font-medium text-blue-900">
                    {data.pagination.total}
                  </span>{' '}
                  productos encontrados
                </div>
              )}

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
                  }}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors"
                >
                  <option value="createdAt-desc">Más Recientes</option>
                  <option value="createdAt-asc">Más Antiguos</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name-asc">Nombre: A a Z</option>
                  <option value="name-desc">Nombre: Z a A</option>
                  <option value="rating-desc">Mejor Calificados</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="primary" className="ml-1 bg-blue-600">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-none border-0 ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'hover:bg-blue-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-none border-0 ${
                    viewMode === 'list'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'hover:bg-blue-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div
            className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            <span className="text-sm font-medium text-gray-700">
              Filtros activos:
            </span>
            {filters.category && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1 bg-blue-100 text-blue-800 border-blue-200"
              >
                <span>Categoría: {filters.category}</span>
                <button
                  onClick={() => handleFilterChange({ category: undefined })}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.gender && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1 bg-purple-100 text-purple-800 border-purple-200"
              >
                <span>Género: {filters.gender}</span>
                <button
                  onClick={() => handleFilterChange({ gender: undefined })}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1 bg-green-100 text-green-800 border-green-200"
              >
                <span>
                  Precio: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                </span>
                <button
                  onClick={() =>
                    handleFilterChange({
                      minPrice: undefined,
                      maxPrice: undefined,
                    })
                  }
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.size && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1 bg-orange-100 text-orange-800 border-orange-200"
              >
                <span>Talla: {filters.size}</span>
                <button
                  onClick={() => handleFilterChange({ size: undefined })}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.color && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1 bg-pink-100 text-pink-800 border-pink-200"
              >
                <span>Color: {filters.color}</span>
                <button
                  onClick={() => handleFilterChange({ color: undefined })}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.brand && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1 bg-indigo-100 text-indigo-800 border-indigo-200"
              >
                <span>Marca: {filters.brand}</span>
                <button
                  onClick={() => handleFilterChange({ brand: undefined })}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
            >
              Limpiar todo
            </Button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-80 flex-shrink-0`}
          >
            <ProductFiltersPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {isLoading ? (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 animate-fade-in-up">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <X className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Error al cargar productos
                </h3>
                <p className="text-gray-600 mb-6">
                  Hubo un problema al cargar los productos. Por favor, inténtalo
                  de nuevo.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Intentar de nuevo
                </Button>
              </div>
            ) : !data?.products.length ? (
              <div className="text-center py-16 animate-fade-in-up">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Filter className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar tus filtros o términos de búsqueda para
                  encontrar lo que buscas.
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Limpiar Filtros
                </Button>
              </div>
            ) : (
              <>
                {/* Products */}
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                  {data.products.map((product: any) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {data.pagination.pages > 1 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/30 p-6 mt-12 animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-sm text-gray-600">
                        Mostrando {(filters.page! - 1) * ITEMS_PER_PAGE + 1} a{' '}
                        {Math.min(
                          filters.page! * ITEMS_PER_PAGE,
                          data.pagination.total
                        )}{' '}
                        de {data.pagination.total} productos
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(filters.page! - 1)}
                          disabled={filters.page === 1}
                          className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 disabled:opacity-50"
                        >
                          Anterior
                        </Button>

                        {Array.from(
                          { length: Math.min(5, data.pagination.pages) },
                          (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                variant={
                                  page === filters.page ? 'primary' : 'outline'
                                }
                                onClick={() => handlePageChange(page)}
                                className={
                                  page === filters.page
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                                    : 'hover:bg-blue-50 hover:border-blue-300 transition-all duration-300'
                                }
                              >
                                {page}
                              </Button>
                            );
                          }
                        )}

                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(filters.page! + 1)}
                          disabled={filters.page === data.pagination.pages}
                          className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 disabled:opacity-50"
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
