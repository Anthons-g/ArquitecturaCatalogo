'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Heart,
  Bell,
  LogOut,
  Settings,
  Package,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 backdrop-blur-md border-b border-blue-200/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Moda Elegante
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch}>
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-blue-400" />}
                className="w-full bg-white/90 border-blue-200 text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            <button className="lg:hidden p-2 text-slate-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                href="/wishlist"
                className="p-2 text-slate-500 hover:text-blue-500 transition-colors relative rounded-lg hover:bg-blue-50"
              >
                <Heart className="w-5 h-5" />
                <Badge
                  variant="error"
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs bg-blue-500 text-white"
                >
                  3
                </Badge>
              </Link>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <button className="p-2 text-slate-500 hover:text-purple-500 transition-colors relative rounded-lg hover:bg-purple-50">
                <Bell className="w-5 h-5" />
                <Badge
                  variant="primary"
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs bg-purple-500 text-white"
                >
                  2
                </Badge>
              </button>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-slate-500 hover:text-indigo-500 transition-colors relative group rounded-lg hover:bg-indigo-50"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" />
              {cart && cart.totalItems > 0 && (
                <Badge
                  variant="primary"
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs animate-bounce-in bg-indigo-500 text-white"
                >
                  {cart.totalItems}
                </Badge>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-600">
                    {user?.firstName}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-blue-200/50 py-2 animate-fade-in-down">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3 text-blue-500" />
                      Mi Perfil
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 rounded-lg mx-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="w-4 h-4 mr-3 text-indigo-500" />
                      Mis Pedidos
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-3 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-lg mx-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-purple-500" />
                      Configuración
                    </Link>
                    {/* Admin Panel - Solo visible para administradores */}
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-sm text-slate-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-3 text-purple-600" />
                        Panel de Administrador
                      </Link>
                    )}
                    <hr className="my-2 border-blue-200/50" />
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg mx-2"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-200/50 py-4 animate-fade-in-down bg-white/95 backdrop-blur-sm">
            <div className="space-y-4 px-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="lg:hidden">
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-blue-400" />}
                  className="bg-white border-blue-200 text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-200/50 shadow-lg"
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
