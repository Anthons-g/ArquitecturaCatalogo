'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const heroSlides = [
  {
    id: 1,
    title: 'Colección Primavera 2024',
    subtitle: 'Descubre las Últimas Tendencias',
    description:
      'Abraza la nueva temporada con nuestra exclusiva colección de primavera, diseñada con telas premium y colores vibrantes que definen el estilo contemporáneo.',
    image: '/hero-1.jpg',
    cta: 'Explorar Colección',
    link: '/products?category=new-arrivals',
    badge: 'Nueva Llegada',
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    id: 2,
    title: 'Elegancia Atemporal',
    subtitle: 'Diseñado para la Sofisticación',
    description:
      'Experimenta la perfecta fusión entre elegancia clásica y diseño moderno con piezas cuidadosamente seleccionadas para cada ocasión especial.',
    image: '/hero-2.jpg',
    cta: 'Ver Elegancia',
    link: '/products?category=elegant',
    badge: 'Más Vendido',
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    id: 3,
    title: 'Accesorios Exclusivos',
    subtitle: 'Completa tu Estilo Único',
    description:
      'Desde joyería artesanal hasta bolsos de diseñador, descubre los accesorios perfectos que elevan tu look y expresan tu personalidad.',
    image: '/hero-3.jpg',
    cta: 'Descubrir Accesorios',
    link: '/products?category=accessories',
    badge: 'Tendencia',
    gradient: 'from-purple-600 to-pink-600',
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/40 to-purple-50/40">
      {/* Background Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Dynamic Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}/20`}
          />
          <div className="absolute inset-0 bg-slate-800/10" />

          {/* Animated Background Elements */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-300/10 rounded-full blur-2xl animate-float"
            style={{ animationDelay: '1s' }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {index === currentSlide && (
                  <>
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 mb-4 sm:mb-6 animate-fade-in-up">
                      <div className="flex items-center space-x-1 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-blue-200/30">
                        <Star className="w-4 h-4 text-blue-500 fill-current" />
                        <span className="text-slate-700 text-sm font-semibold">
                          {slide.badge}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h1
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight animate-fade-in-up"
                      style={{ animationDelay: '0.2s' }}
                    >
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <h2
                      className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium mb-4 sm:mb-6 animate-fade-in-up"
                      style={{ animationDelay: '0.4s' }}
                    >
                      {slide.subtitle}
                    </h2>

                    {/* Description */}
                    <p
                      className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl animate-fade-in-up"
                      style={{ animationDelay: '0.6s' }}
                    >
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up"
                      style={{ animationDelay: '0.8s' }}
                    >
                      <Link href={slide.link} className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          className={`group w-full sm:w-auto bg-gradient-to-r ${slide.gradient} hover:shadow-xl text-white shadow-lg transform hover:scale-105 transition-all duration-300`}
                        >
                          {slide.cta}
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link href="/products" className="w-full sm:w-auto">
                        <Button
                          variant="secondary"
                          size="lg"
                          className="w-full sm:w-auto bg-white/90 backdrop-blur-sm border-blue-200/50 text-slate-700 hover:bg-white hover:border-blue-300/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          Ver Todos los Productos
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:bg-white hover:text-blue-500 transition-all duration-300 group shadow-lg hover:scale-110"
        aria-label="Diapositiva anterior"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:bg-white hover:text-blue-500 transition-all duration-300 group shadow-lg hover:scale-110"
        aria-label="Siguiente diapositiva"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-blue-500 scale-125 shadow-lg'
                : 'bg-white/60 hover:bg-blue-300/70 hover:scale-110'
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-200/30">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 shadow-sm"
          style={{
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}
