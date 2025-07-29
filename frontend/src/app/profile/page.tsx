'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Shield,
  Settings,
  Bell,
  CreditCard,
  Package,
  Heart,
  Star,
  Calendar,
  Award,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'México',
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-gray-600 mb-8">
              Por favor inicia sesión para ver tu perfil.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Iniciar Sesión
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    toast.success('¡Perfil actualizado exitosamente!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'México',
      },
    });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'personal', label: 'Información Personal', icon: User },
    { id: 'orders', label: 'Mis Pedidos', icon: Package },
    { id: 'favorites', label: 'Favoritos', icon: Heart },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const stats = [
    { icon: Package, label: 'Pedidos', value: '12', color: 'blue' },
    { icon: Heart, label: 'Favoritos', value: '8', color: 'red' },
    { icon: Star, label: 'Reseñas', value: '5', color: 'yellow' },
    { icon: Award, label: 'Puntos', value: '2,450', color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-2">
              Mi Perfil
            </h1>
            <p className="text-gray-600">
              Gestiona tu información de cuenta y preferencias
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card
                className="p-6 text-center bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-lg animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Cuenta Activa</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                    <Calendar className="w-4 h-4" />
                    <span>Miembro desde 2024</span>
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <Card
                className="p-6 bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-lg animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Estadísticas
                </h3>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                          <stat.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {stat.label}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Navigation */}
              <Card
                className="p-4 bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-lg animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'personal' && (
                <Card
                  className="p-8 bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-lg animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Información Personal
                    </h3>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </Button>
                    ) : (
                      <div className="flex space-x-3">
                        <Button
                          onClick={handleSave}
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Save className="w-4 h-4" />
                          <span>Guardar</span>
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancelar</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    {/* Basic Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Información Básica
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Nombre"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          leftIcon={<User className="w-4 h-4 text-blue-400" />}
                          className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200"
                        />
                        <Input
                          label="Apellido"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          leftIcon={<User className="w-4 h-4 text-blue-400" />}
                          className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200"
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Información de Contacto
                      </h4>
                      <div className="space-y-6">
                        <Input
                          label="Correo Electrónico"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          leftIcon={<Mail className="w-4 h-4 text-blue-400" />}
                          className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200"
                        />

                        <Input
                          label="Teléfono"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          leftIcon={<Phone className="w-4 h-4 text-blue-400" />}
                          placeholder="+52 (555) 123-4567"
                          className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                        Dirección
                      </h4>
                      <div className="space-y-6">
                        <Input
                          label="Dirección"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Calle Principal 123"
                          className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                            label="Ciudad"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Ciudad de México"
                            className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200"
                          />
                          <Input
                            label="Estado"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="CDMX"
                            className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                            label="Código Postal"
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="01000"
                            className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200"
                          />
                          <Input
                            label="País"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="México"
                            className="bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-blue-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'orders' && (
                <Card
                  className="p-8 bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-lg animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Mis Pedidos
                  </h3>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tienes pedidos aún</p>
                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Comenzar a Comprar
                    </Button>
                  </div>
                </Card>
              )}

              {activeTab === 'favorites' && (
                <Card
                  className="p-8 bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-lg animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Mis Favoritos
                  </h3>
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No tienes productos favoritos aún
                    </p>
                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Explorar Productos
                    </Button>
                  </div>
                </Card>
              )}

              {activeTab === 'settings' && (
                <Card
                  className="p-8 bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-lg animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Configuración
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Notificaciones por Email
                          </h4>
                          <p className="text-sm text-gray-600">
                            Recibe actualizaciones sobre tus pedidos
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Métodos de Pago
                          </h4>
                          <p className="text-sm text-gray-600">
                            Gestiona tus tarjetas guardadas
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Gestionar
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
