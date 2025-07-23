'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Moda Femenina',
    description: 'Estilos elegantes para cada ocasión',
    image: '/category-women.jpg',
    href: '/category/women',
    color: 'from-rose-300 to-pink-300',
    items: '2,847 productos',
  },
  {
    id: 2,
    name: 'Moda Masculina',
    description: 'Looks contemporáneos para hombres modernos',
    image: '/category-men.jpg',
    href: '/category/men',
    color: 'from-slate-300 to-slate-400',
    items: '1,923 productos',
  },
  {
    id: 3,
    name: 'Accesorios',
    description: 'Completa tu look perfecto',
    image: '/category-accessories.jpg',
    href: '/category/accessories',
    color: 'from-pink-300 to-rose-300',
    items: '1,456 productos',
  },
  {
    id: 4,
    name: 'Zapatos',
    description: 'Sal con estilo',
    image: '/category-shoes.jpg',
    href: '/category/shoes',
    color: 'from-rose-300 to-pink-400',
    items: '892 productos',
  },
  {
    id: 5,
    name: 'Bolsos',
    description: 'Lleva tus esenciales con estilo',
    image: '/category-bags.jpg',
    href: '/category/bags',
    color: 'from-pink-300 to-rose-400',
    items: '634 productos',
  },
  {
    id: 6,
    name: 'Ofertas',
    description: 'Hasta 70% de descuento en productos seleccionados',
    image: '/category-sale.jpg',
    href: '/sale',
    color: 'from-rose-400 to-pink-500',
    items: '1,234 productos',
    badge: 'Oferta Especial',
  },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          href={category.href}
          className="group relative overflow-hidden rounded-2xl bg-white/80 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border border-rose-200/50"
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-95`}
          />

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]" />
          </div>

          {/* Content */}
          <div className="relative p-6 sm:p-8 h-56 sm:h-64 flex flex-col justify-between">
            {/* Badge */}
            {category.badge && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1">
                <span className="text-white text-xs font-semibold">
                  {category.badge}
                </span>
              </div>
            )}

            {/* Category Info */}
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300 leading-tight">
                {category.name}
              </h3>
              <p className="text-white/90 text-sm mb-3 sm:mb-4 leading-relaxed">
                {category.description}
              </p>
              <div className="text-white/80 text-xs font-medium">
                {category.items}
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="flex justify-end mt-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

          {/* Animated Border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/50 transition-all duration-300" />
        </Link>
      ))}
    </div>
  );
}
