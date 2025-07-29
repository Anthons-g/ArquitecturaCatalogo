'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShoppingBag,
  Shield,
  Zap,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Shield, text: 'Compras 100% seguras' },
    { icon: Zap, text: 'Envío express disponible' },
    { icon: Heart, text: 'Atención personalizada' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-300/20 to-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: '1s' }}
        ></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
        <div
          className="absolute top-2/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-70 animate-pulse"
          style={{ animationDelay: '0.5s' }}
        ></div>
        <div
          className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-50 animate-pulse"
          style={{ animationDelay: '1.5s' }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Welcome Message */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md space-y-8 animate-fade-in-left">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                ¡Bienvenido de Vuelta!
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Accede a tu cuenta y continúa explorando las mejores tendencias
                de moda
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center shadow-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">{feature.text}</p>
                </div>
              ))}
            </div>

            {/* Demo Users */}
            <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-blue-200/50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Usuarios de prueba:
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div>
                  👤 <strong>Cliente:</strong> customer@demo.com
                </div>
                <div>
                  🛡️ <strong>Admin:</strong> admin@demo.com
                </div>
                <div>
                  🔑 <strong>Contraseña:</strong> password123
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center animate-fade-in-up">
              <Link
                href="/"
                className="inline-flex items-center space-x-3 mb-8 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <ShoppingBag className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Moda Elegante
                </span>
              </Link>
            </div>

            {/* Form Header */}
            <div
              className="text-center animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600">Accede a tu cuenta personal</p>
            </div>

            {/* Login Form */}
            <Card
              className="p-8 bg-white/80 backdrop-blur-lg border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className="animate-slide-in-left"
                  style={{ animationDelay: '0.5s' }}
                >
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    leftIcon={<Mail className="w-4 h-4 text-blue-400" />}
                    className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                </div>

                <div
                  className="animate-slide-in-right"
                  style={{ animationDelay: '0.6s' }}
                >
                  <Input
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                    leftIcon={<Lock className="w-4 h-4 text-blue-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-blue-500 hover:scale-110 transition-all duration-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    }
                    className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                </div>

                <div
                  className="flex items-center justify-between animate-fade-in-up"
                  style={{ animationDelay: '0.7s' }}
                >
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-300"
                    />
                    <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      Recordarme
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 hover:underline hover:underline-offset-4"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <div
                  className="animate-bounce-in"
                  style={{ animationDelay: '0.8s' }}
                >
                  <Button
                    type="submit"
                    loading={isLoading}
                    fullWidth
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-500 group transform hover:scale-105 hover:-translate-y-1 active:scale-95"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Iniciando sesión...</span>
                      </div>
                    ) : (
                      <>
                        <span className="group-hover:scale-110 transition-transform duration-300">
                          Iniciar Sesión
                        </span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Social Login Options */}
                <div
                  className="relative animate-fade-in-up"
                  style={{ animationDelay: '0.9s' }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      O continúa con
                    </span>
                  </div>
                </div>

                <div
                  className="grid grid-cols-2 gap-3 animate-fade-in-up"
                  style={{ animationDelay: '1s' }}
                >
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:scale-105 transition-all duration-300"
                  >
                    <span className="text-lg mr-2">🔍</span>
                    Google
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:scale-105 transition-all duration-300"
                  >
                    <span className="text-lg mr-2">📘</span>
                    Facebook
                  </button>
                </div>
              </form>
            </Card>

            {/* Sign Up Link */}
            <div
              className="text-center animate-fade-in-up"
              style={{ animationDelay: '1.1s' }}
            >
              <p className="text-gray-600 hover:text-gray-700 transition-colors duration-300">
                ¿No tienes una cuenta?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-all duration-300 hover:underline hover:underline-offset-4 inline-block hover:scale-105"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
