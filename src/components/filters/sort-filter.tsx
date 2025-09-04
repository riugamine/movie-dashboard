/**
 * Filtro de Ordenamiento - Componente elegante para criterios de ordenación
 * 
 * Patrón de diseño: Simple State + Options Pattern
 * - Opciones predefinidas con iconos descriptivos
 * - Feedback visual claro del estado actual
 * - Diseño minimalista y funcional
 */

'use client';

import { useState, useEffect } from 'react';
import { ArrowUpDown, TrendingUp, Star, Calendar, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type SortOption = 
  | 'popularity.desc' 
  | 'popularity.asc' 
  | 'vote_average.desc' 
  | 'vote_average.asc' 
  | 'release_date.desc' 
  | 'release_date.asc';

interface SortFilterProps {
  /** Criterio de ordenamiento inicial */
  initialSortBy?: SortOption;
  /** Callback cuando cambia el ordenamiento */
  onSortChange: (sortBy: SortOption) => void;
  /** Título del filtro */
  title?: string;
  /** Descripción del filtro */
  description?: string;
  /** Si está deshabilitado */
  disabled?: boolean;
}

/**
 * Configuración de opciones de ordenamiento con metadatos
 */
const SORT_OPTIONS = {
  'popularity.desc': {
    label: 'Más Popular',
    description: 'Películas más populares primero',
    icon: TrendingUp,
    color: 'text-accent',
  },
  'popularity.asc': {
    label: 'Menos Popular',
    description: 'Películas menos populares primero',
    icon: TrendingUp,
    color: 'text-muted-foreground',
  },
  'vote_average.desc': {
    label: 'Mejor Calificadas',
    description: 'Mejor puntuación promedio primero',
    icon: Star,
    color: 'text-secondary',
  },
  'vote_average.asc': {
    label: 'Peor Calificadas',
    description: 'Menor puntuación promedio primero',
    icon: Star,
    color: 'text-muted-foreground',
  },
  'release_date.desc': {
    label: 'Más Recientes',
    description: 'Fecha de lanzamiento más reciente primero',
    icon: Calendar,
    color: 'text-primary',
  },
  'release_date.asc': {
    label: 'Más Antiguas',
    description: 'Fecha de lanzamiento más antigua primero',
    icon: Calendar,
    color: 'text-muted-foreground',
  },
} as const;

/**
 * Componente de filtro de ordenamiento con diseño cinematográfico
 */
export function SortFilter({
  initialSortBy = 'popularity.desc',
  onSortChange,
  title = 'Ordenar Por',
  description = 'Elige cómo quieres ordenar las películas',
  disabled = false,
}: SortFilterProps) {
  // Estado interno del componente
  const [selectedSort, setSelectedSort] = useState<SortOption>(initialSortBy);

  /**
   * Maneja el cambio de criterio de ordenamiento
   */
  const handleSortChange = (value: SortOption) => {
    setSelectedSort(value);
    onSortChange(value);
  };

  // Efecto para sincronizar con props iniciales
  useEffect(() => {
    if (initialSortBy !== selectedSort) {
      setSelectedSort(initialSortBy);
    }
  }, [initialSortBy]);

  const currentOption = SORT_OPTIONS[selectedSort];
  const IconComponent = currentOption.icon;

  return (
    <Card className="cinema-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="outline" className="ml-auto">
            {currentOption.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selector principal */}
        <div className="space-y-2">
          <Label htmlFor="sort-select" className="text-sm font-medium">
            Criterio de Ordenamiento
          </Label>
          <Select
            value={selectedSort}
            onValueChange={handleSortChange}
            disabled={disabled}
          >
            <SelectTrigger id="sort-select" className="w-full">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <IconComponent className={`h-4 w-4 ${currentOption.color}`} />
                  <span>{currentOption.label}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_OPTIONS).map(([value, option]) => {
                const OptionIcon = option.icon;
                return (
                  <SelectItem key={value} value={value} className="cursor-pointer">
                    <div className="flex items-center gap-3 py-1">
                      <OptionIcon className={`h-4 w-4 ${option.color}`} />
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Información del criterio actual */}
        <div className="bg-primary/5 p-3 rounded-md border border-primary/10">
          <div className="flex items-center gap-2 mb-1">
            <IconComponent className={`h-4 w-4 ${currentOption.color}`} />
            <span className="text-sm font-medium">{currentOption.label}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {currentOption.description}
          </p>
        </div>

        {/* Accesos rápidos a criterios populares */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Accesos Rápidos:</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSortChange('popularity.desc')}
              disabled={disabled || selectedSort === 'popularity.desc'}
              className={`p-2 rounded-md border text-left transition-all ${
                selectedSort === 'popularity.desc'
                  ? 'bg-accent/20 border-accent text-accent-foreground'
                  : 'hover:bg-muted border-border'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                <span className="text-xs font-medium">Trending</span>
              </div>
            </button>
            
            <button
              onClick={() => handleSortChange('vote_average.desc')}
              disabled={disabled || selectedSort === 'vote_average.desc'}
              className={`p-2 rounded-md border text-left transition-all ${
                selectedSort === 'vote_average.desc'
                  ? 'bg-secondary/20 border-secondary text-secondary-foreground'
                  : 'hover:bg-muted border-border'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3" />
                <span className="text-xs font-medium">Top Rated</span>
              </div>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
