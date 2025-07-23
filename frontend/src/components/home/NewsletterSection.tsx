'use client';

import { useState } from 'react';
import { Mail, Gift, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor ingresa tu dirección de correo electrónico');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Por favor ingresa una dirección de correo válida');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement newsletter subscription API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast.success('¡Te has suscrito exitosamente a nuestro boletín!');
      setEmail('');
    } catch (error) {
      toast.error('Error al suscribirse. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-rose-200 via-pink-200 to-rose-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float" />
        <div className="absolute top-32 right-20 w-20 h-20 bg-white/5 rounded-full animate-float animation-delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-2000" />
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-white/5 rounded-full animate-float animation-delay-500" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMjAgMjBjMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTAgNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMHptMTAgMGMwLTUuNS00LjUtMTAtMTAtMTBzLTEwIDQuNS0xMCAxMCA0LjUgMTAgMTAgMTAgMTAtNC41IDEwLTEweiIvPjwvZz48L2c+PC9zdmc+")]' />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Mantente Conectado
          </h2>

          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            Suscríbete a nuestro boletín y sé el primero en conocer las nuevas
            colecciones, ofertas exclusivas y consejos de moda de nuestros
            expertos en estilo.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
            <div className="flex items-center justify-center space-x-3 text-white/90 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <Gift className="w-5 h-5 text-white" />
              <span className="font-medium">Ofertas Exclusivas</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white/90 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="font-medium">Acceso Anticipado</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white/90 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <Mail className="w-5 h-5 text-white" />
              <span className="font-medium">Consejos de Estilo</span>
            </div>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40 rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                loading={isLoading}
                className="h-12 bg-white text-slate-700 hover:bg-rose-50 focus:ring-rose-200/50 group px-8 rounded-xl font-semibold shadow-lg hover:shadow-rose"
              >
                Suscribirse
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </form>

          {/* Privacy Note */}
          <p className="text-white/70 text-sm mt-6">
            Respetamos tu privacidad. Puedes cancelar la suscripción en
            cualquier momento.
          </p>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/80 mb-4 text-lg">
              Únete a más de 50,000 entusiastas de la moda
            </p>
            <div className="flex justify-center items-center space-x-2">
              {/* Avatar Stack */}
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white text-sm font-semibold">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-white/80 text-sm ml-3">
                y muchos más...
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
