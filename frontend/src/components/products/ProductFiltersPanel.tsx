'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { ProductFilters } from '@/lib/api/products';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface ProductFiltersPanelProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
}

const categories = [
  { value: 'shirts', label: 'Camisas' },
  { value: 'pants', label: 'Pantalones' },
  { value: 'dresses', label: 'Vestidos' },
  { value: 'shoes', label: 'Zapatos' },
  { value: 'accessories', label: 'Accesorios' },
  { value: 'jackets', label: 'Chaquetas' },
  { value: 'underwear', label: 'Ropa Interior' },
];

const genders = [
  { value: 'men', label: 'Hombre' },
  { value: 'women', label: 'Mujer' },
  { value: 'unisex', label: 'Unisex' },
];

const sizes = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];

const colors = [
  { value: 'black', label: 'Negro', color: '#000000' },
  { value: 'white', label: 'Blanco', color: '#FFFFFF' },
  { value: 'red', label: 'Rojo', color: '#EF4444' },
  { value: 'blue', label: 'Azul', color: '#3B82F6' },
  { value: 'green', label: 'Verde', color: '#10B981' },
  { value: 'yellow', label: 'Amarillo', color: '#F59E0B' },
  { value: 'purple', label: 'Morado', color: '#8B5CF6' },
  { value: 'pink', label: 'Rosa', color: '#EC4899' },
  { value: 'gray', label: 'Gris', color: '#6B7280' },
  { value: 'brown', label: 'Marrón', color: '#92400E' },
];

const brands = [
  'Nike',
  'Adidas',
  'Zara',
  'H&M',
  'Uniqlo',
  'Gap',
  "Levi's",
  'Calvin Klein',
  'Tommy Hilfiger',
  'Ralph Lauren',
];

export function ProductFiltersPanel({
  filters,
  onFilterChange,
  onClearFilters,
}: ProductFiltersPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    gender: true,
    price: true,
    size: true,
    color: true,
    brand: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3 hover:text-primary-600 transition-colors"
      >
        <span>{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections[section] && <div className="space-y-2">{children}</div>}
    </div>
  );

  return (
    <Card className="p-6 sticky top-8 bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Filtros</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Limpiar Todo
        </Button>
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <FilterSection title="Categoría" section="category">
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={filters.category === category.value}
                  onChange={(e) =>
                    onFilterChange({
                      category: e.target.checked ? category.value : undefined,
                    })
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{category.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Gender Filter */}
        <FilterSection title="Género" section="gender">
          <div className="space-y-2">
            {genders.map((gender) => (
              <label
                key={gender.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender.value}
                  checked={filters.gender === gender.value}
                  onChange={(e) =>
                    onFilterChange({
                      gender: e.target.checked ? gender.value : undefined,
                    })
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{gender.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Filter */}
        <FilterSection title="Rango de Precio" section="price">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Mín"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  onFilterChange({
                    minPrice: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                className="text-sm"
              />
              <Input
                type="number"
                placeholder="Máx"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  onFilterChange({
                    maxPrice: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                className="text-sm"
              />
            </div>

            {/* Quick Price Ranges */}
            <div className="space-y-1">
              {[
                { label: 'Menos de $25', min: 0, max: 25 },
                { label: '$25 - $50', min: 25, max: 50 },
                { label: '$50 - $100', min: 50, max: 100 },
                { label: '$100 - $200', min: 100, max: 200 },
                { label: 'Más de $200', min: 200, max: undefined },
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() =>
                    onFilterChange({
                      minPrice: range.min,
                      maxPrice: range.max,
                    })
                  }
                  className={`block w-full text-left text-sm py-1 px-2 rounded hover:bg-blue-50 transition-colors ${
                    filters.minPrice === range.min &&
                    filters.maxPrice === range.max
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Size Filter */}
        <FilterSection title="Talla" section="size">
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size.value}
                onClick={() =>
                  onFilterChange({
                    size: filters.size === size.value ? undefined : size.value,
                  })
                }
                className={`py-2 px-3 text-sm border rounded-lg transition-all duration-200 ${
                  filters.size === size.value
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Color Filter */}
        <FilterSection title="Color" section="color">
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() =>
                  onFilterChange({
                    color:
                      filters.color === color.value ? undefined : color.value,
                  })
                }
                className={`relative w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  filters.color === color.value
                    ? 'border-blue-600 scale-110'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                style={{ backgroundColor: color.color }}
                title={color.label}
                aria-label={color.label}
              >
                {color.value === 'white' && (
                  <div className="absolute inset-1 border border-slate-200 rounded-full" />
                )}
                {filters.color === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        color.value === 'white' || color.value === 'yellow'
                          ? 'bg-slate-800'
                          : 'bg-white'
                      }`}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection title="Marca" section="brand">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="brand"
                  value={brand}
                  checked={filters.brand === brand}
                  onChange={(e) =>
                    onFilterChange({
                      brand: e.target.checked ? brand : undefined,
                    })
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </Card>
  );
}
