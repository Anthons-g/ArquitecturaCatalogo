'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'María González',
    role: 'Influencer de Moda',
    avatar: '/avatar-1.jpg',
    rating: 5,
    content:
      'Absolutamente enamorada de la calidad y estilo de la ropa de Fashion Store. La atención al detalle es increíble, y el servicio al cliente es excepcional. ¡He sido cliente leal por más de dos años!',
    location: 'Madrid, España',
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    role: 'Director Creativo',
    avatar: '/avatar-2.jpg',
    rating: 5,
    content:
      '¡La colección masculina es fantástica! Excelente ajuste, materiales premium, y los diseños siempre están a la moda. Envío rápido y devoluciones fáciles hacen que comprar aquí sea un placer.',
    location: 'Barcelona, España',
  },
  {
    id: 3,
    name: 'Ana Rodríguez',
    role: 'Gerente de Marketing',
    avatar: '/avatar-3.jpg',
    rating: 5,
    content:
      'He encontrado mi tienda favorita para ropa profesional y casual. La variedad es increíble, y siempre recibo cumplidos cuando uso sus piezas. ¡Altamente recomendado!',
    location: 'Valencia, España',
  },
  {
    id: 4,
    name: 'Diego Torres',
    role: 'Empresario',
    avatar: '/avatar-4.jpg',
    rating: 5,
    content:
      'Calidad excepcional a precios razonables. El sitio web es fácil de navegar, y las descripciones de productos son precisas. Mis pedidos siempre llegan rápido y bien empaquetados.',
    location: 'Sevilla, España',
  },
  {
    id: 5,
    name: 'Laura Martín',
    role: 'Diseñadora de Interiores',
    avatar: '/avatar-5.jpg',
    rating: 5,
    content:
      'Fashion Store se ha convertido en mi destino favorito de compras online. Las colecciones de temporada siempre son frescas y emocionantes. ¡Me encantan las opciones de moda sostenible también!',
    location: 'Bilbao, España',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-purple-50/40 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

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
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6 shadow-xl">
            <Quote className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-6">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            No solo confíes en nuestra palabra. Descubre lo que nuestros
            clientes satisfechos tienen que decir sobre su experiencia con Moda
            Elegante.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4 md:px-6"
                >
                  <div className="bg-white/90 rounded-3xl shadow-blue-lg border border-blue-200/50 p-8 md:p-12 relative backdrop-blur-sm hover:shadow-blue-xl hover:bg-blue-50/40 transition-all duration-300">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 text-blue-300/30">
                      <Quote className="w-12 h-12 md:w-16 md:h-16" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-amber-400 fill-current drop-shadow-sm"
                        />
                      ))}
                      <span className="ml-2 text-sm text-slate-500 font-medium">
                        {testimonial.rating}.0
                      </span>
                    </div>

                    {/* Content */}
                    <blockquote className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8 font-medium relative">
                      <span className="text-blue-400 text-4xl absolute -top-2 -left-1">
                        "
                      </span>
                      <span className="pl-6">{testimonial.content}</span>
                      <span className="text-blue-400 text-4xl">"</span>
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center space-x-4">
                      {/* Avatar Placeholder */}
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                        <span className="text-white text-xl md:text-2xl font-bold">
                          {testimonial.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="font-bold text-slate-700 text-lg md:text-xl">
                          {testimonial.name}
                        </div>
                        <div className="text-blue-600 font-semibold text-sm md:text-base">
                          {testimonial.role}
                        </div>
                        <div className="text-slate-500 text-sm flex items-center mt-1">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-blue border border-blue-200/50 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:shadow-blue-lg hover:scale-110 transition-all duration-300 group"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-blue border border-blue-200/50 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:shadow-blue-lg hover:scale-110 transition-all duration-300 group"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-3 bg-blue-500 scale-110'
                  : 'w-3 h-3 bg-slate-400/30 hover:bg-blue-300/50 hover:scale-110'
              }`}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-blue-200/30">
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              50K+
            </div>
            <div className="text-slate-600 font-medium">
              Clientes Satisfechos
            </div>
          </div>
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              4.9
            </div>
            <div className="text-slate-600 font-medium">
              Calificación Promedio
            </div>
          </div>
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              99%
            </div>
            <div className="text-slate-600 font-medium">
              Tasa de Satisfacción
            </div>
          </div>
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">
              24/7
            </div>
            <div className="text-slate-600 font-medium">Soporte al Cliente</div>
          </div>
        </div>
      </div>
    </section>
  );
}
