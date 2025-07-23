'use client';

import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'Productos', href: '/products' },
      { name: 'Ofertas', href: '/products?sale=true' },
      { name: 'Categorías', href: '/categories' },
    ],
    support: [
      { name: 'Contáctanos', href: '/contact' },
      { name: 'Envíos', href: '/shipping' },
      { name: 'Devoluciones', href: '/returns' },
      { name: 'FAQ', href: '/faq' },
    ],
    legal: [
      { name: 'Privacidad', href: '/privacy' },
      { name: 'Términos', href: '/terms' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Envío Gratuito',
      description: 'En pedidos mayores a $50',
    },
    {
      icon: RefreshCw,
      title: 'Devoluciones',
      description: 'Política de 30 días',
    },
    {
      icon: Shield,
      title: 'Pago Seguro',
      description: 'Checkout protegido',
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300">
      {/* Features Section */}
      <div className="border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Moda Elegante
              </span>
            </Link>

            <p className="text-slate-400 mb-6 leading-relaxed">
              Tu tienda de moda online con los mejores productos y precios.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-400">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>info@modaelegante.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold text-slate-200 mb-4">Tienda</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-4">Soporte</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © {currentYear} Moda Elegante. Todos los derechos reservados.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-600 transition-all duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
