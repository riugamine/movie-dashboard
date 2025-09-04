/**
 * Movie Filters - Componente integrador de todos los filtros del dashboard
 * 
 * Patrón de diseño: Container/Presentational + State Management
 * - Maneja el estado centralizado de todos los filtros
 * - Coordina la comunicación entre filtros
 * - Proporciona funciones de reset y aplicación
 * - Diseño responsive y accesible
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings, RefreshCw, Search, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DateRangeFilter } from './date-range-filter';
import { GenreFilter } from './genre-filter';
import { SortFilter } from './sort-filter';
import { VoteFilter } from './vote-filter';
import type { DashboardFilters, Genre } from '@/lib/types';

interface MovieFiltersProps {
  /** Géneros disponibles */
  genres: Genre[];
  /** Filtros iniciales */
  initialFilters?: Partial<DashboardFilters>;
  /** Callback cuando cambian los filtros */
  onFiltersChange: (filters: DashboardFilters) => void;
  /** Si está cargando los géneros */
  isLoadingGenres?: boolean;
  /** Si los filtros están siendo aplicados */
  isApplying?: boolean;
  /** Título del panel de filtros */
  title?: string;
  /** Si está en modo compacto */
  compact?: boolean;
}

/**
 * Filtros por defecto del sistema
 */
const DEFAULT_FILTERS: DashboardFilters = {
  startDate: '',
  endDate: '',
  genres: [],
  sortBy: 'popularity.desc',
  minVoteCount: 100,
};

/**
 * Componente principal de filtros de películas
 */
export function MovieFilters({
  genres,
  initialFilters = {},
  onFiltersChange,
  isLoadingGenres = false,
  isApplying = false,
  title = 'Filtros de Películas',
  compact = false,
}: MovieFiltersProps) {
  // Estado centralizado de todos los filtros
  const [filters, setFilters] = useState<DashboardFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  // Estado para tracking de cambios
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  /**
   * Actualiza un filtro específico
   */
  const updateFilter = useCallback(<K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K]
  ) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      setHasUnsavedChanges(true);
      
      // Auto-aplicar cambios (debounced)
      setTimeout(() => {
        onFiltersChange(newFilters);
        setHasUnsavedChanges(false);
      }, 300);
      
      return newFilters;
    });
  }, [onFiltersChange]);

  /**
   * Resetea todos los filtros a sus valores por defecto
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setHasUnsavedChanges(false);
    onFiltersChange(DEFAULT_FILTERS);
  }, [onFiltersChange]);

  /**
   * Aplica filtros populares predefinidos
   */
  const applyPopularFilters = useCallback(() => {
    const popularFilters: DashboardFilters = {
      startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Último año
      endDate: new Date().toISOString().split('T')[0],
      genres: [28, 12, 878, 35, 18], // Acción, Aventura, Sci-Fi, Comedia, Drama
      sortBy: 'popularity.desc',
      minVoteCount: 500,
    };
    
    setFilters(popularFilters);
    setHasUnsavedChanges(false);
    onFiltersChange(popularFilters);
  }, [onFiltersChange]);

  /**
   * Calcula el número de filtros activos
   */
  const calculateActiveFilters = useCallback((currentFilters: DashboardFilters): number => {
    let count = 0;
    
    if (currentFilters.startDate || currentFilters.endDate) count++;
    if (currentFilters.genres.length > 0) count++;
    if (currentFilters.sortBy !== DEFAULT_FILTERS.sortBy) count++;
    if (currentFilters.minVoteCount !== DEFAULT_FILTERS.minVoteCount) count++;
    
    return count;
  }, []);

  // Efecto para contar filtros activos
  useEffect(() => {
    setActiveFiltersCount(calculateActiveFilters(filters));
  }, [filters, calculateActiveFilters]);

  // Efecto para sincronizar con filtros iniciales
  useEffect(() => {
    const newFilters = { ...DEFAULT_FILTERS, ...initialFilters };
    setFilters(newFilters);
    setActiveFiltersCount(calculateActiveFilters(newFilters));
  }, [initialFilters, calculateActiveFilters]);

  return (
    <Card className="cinema-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold cinema-text-gradient">
              {title}
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="cinema-glow">
                {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-xs animate-pulse">
                Aplicando...
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={applyPopularFilters}
              disabled={isApplying}
              className="text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Popular
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              disabled={isApplying || activeFiltersCount === 0}
              className="text-xs hover:bg-destructive/10 hover:text-destructive"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Indicador de estado */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <span>
            {activeFiltersCount === 0 
              ? 'Sin filtros aplicados - Mostrando todas las películas'
              : `${activeFiltersCount} filtro${activeFiltersCount !== 1 ? 's' : ''} aplicado${activeFiltersCount !== 1 ? 's' : ''}`
            }
          </span>
          {isApplying && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs">Actualizando...</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Grid de filtros - responsive */}
        <div className={`grid gap-6 ${
          compact 
            ? 'grid-cols-1 lg:grid-cols-2' 
            : 'grid-cols-1 xl:grid-cols-2'
        }`}>
          {/* Filtro de fechas */}
          <DateRangeFilter
            initialStartDate={filters.startDate}
            initialEndDate={filters.endDate}
            onDateRangeChange={(startDate, endDate) => {
              updateFilter('startDate', startDate);
              updateFilter('endDate', endDate);
            }}
            disabled={isApplying}
          />

          {/* Filtro de géneros */}
          <GenreFilter
            genres={genres}
            initialSelectedGenres={filters.genres}
            onGenreSelectionChange={(genres) => updateFilter('genres', genres)}
            isLoading={isLoadingGenres}
            disabled={isApplying}
          />

          {/* Filtro de ordenamiento */}
          <SortFilter
            initialSortBy={filters.sortBy}
            onSortChange={(sortBy) => updateFilter('sortBy', sortBy)}
            disabled={isApplying}
          />

          {/* Filtro de votación */}
          <VoteFilter
            initialMinVoteCount={filters.minVoteCount}
            onVoteCountChange={(minVoteCount) => updateFilter('minVoteCount', minVoteCount)}
            disabled={isApplying}
          />
        </div>

        {/* Resumen de filtros activos */}
        {activeFiltersCount > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Filtros Aplicados:
              </h4>
              <div className="flex flex-wrap gap-2">
                {(filters.startDate || filters.endDate) && (
                  <Badge variant="outline" className="text-xs">
                    📅 {filters.startDate && filters.endDate 
                      ? `${filters.startDate} - ${filters.endDate}`
                      : 'Rango de fechas parcial'
                    }
                  </Badge>
                )}
                
                {filters.genres.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    🎭 {filters.genres.length} género{filters.genres.length !== 1 ? 's' : ''}
                  </Badge>
                )}
                
                {filters.sortBy !== DEFAULT_FILTERS.sortBy && (
                  <Badge variant="outline" className="text-xs">
                    🔄 Ordenado por {filters.sortBy.includes('popularity') ? 'popularidad' : 
                      filters.sortBy.includes('vote') ? 'votación' : 'fecha'}
                  </Badge>
                )}
                
                {filters.minVoteCount !== DEFAULT_FILTERS.minVoteCount && (
                  <Badge variant="outline" className="text-xs">
                    👥 Mín. {filters.minVoteCount.toLocaleString()} votos
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
