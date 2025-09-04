/**
 * Filtro de Géneros - Componente elegante para selección múltiple de géneros
 * 
 * Patrón de diseño: Render Props + Compound Components
 * - Estado centralizado con múltiples vistas
 * - Búsqueda en tiempo real
 * - Selección múltiple con badges
 * - Diseño responsive y accesible
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Film, X, Check, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Genre } from '@/lib/types';

interface GenreFilterProps {
  /** Lista de géneros disponibles */
  genres: Genre[];
  /** IDs de géneros seleccionados inicialmente */
  initialSelectedGenres?: number[];
  /** Callback cuando cambia la selección de géneros */
  onGenreSelectionChange: (selectedGenreIds: number[]) => void;
  /** Callback cuando se limpia el filtro */
  onClear?: () => void;
  /** Si está cargando los géneros */
  isLoading?: boolean;
  /** Título del filtro */
  title?: string;
  /** Descripción del filtro */
  description?: string;
  /** Si está deshabilitado */
  disabled?: boolean;
  /** Número máximo de géneros seleccionables */
  maxSelection?: number;
}

/**
 * Componente de filtro de géneros con diseño cinematográfico
 */
export function GenreFilter({
  genres,
  initialSelectedGenres = [],
  onGenreSelectionChange,
  onClear,
  isLoading = false,
  title = 'Géneros de Películas',
  description = 'Selecciona los géneros que te interesan',
  disabled = false,
  maxSelection = 5,
}: GenreFilterProps) {
  // Estado interno del componente
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>(initialSelectedGenres);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  /**
   * Géneros filtrados por término de búsqueda
   */
  const filteredGenres = useMemo(() => {
    if (!searchTerm) return genres;
    
    return genres.filter(genre =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [genres, searchTerm]);

  /**
   * Géneros seleccionados con información completa
   */
  const selectedGenres = useMemo(() => {
    return genres.filter(genre => selectedGenreIds.includes(genre.id));
  }, [genres, selectedGenreIds]);

  /**
   * Maneja la selección/deselección de un género
   */
  const toggleGenre = (genreId: number) => {
    setSelectedGenreIds(prev => {
      let newSelection: number[];
      
      if (prev.includes(genreId)) {
        // Deseleccionar género
        newSelection = prev.filter(id => id !== genreId);
      } else {
        // Seleccionar género (respetando límite máximo)
        if (prev.length >= maxSelection) {
          // Reemplazar el primer género seleccionado
          newSelection = [...prev.slice(1), genreId];
        } else {
          newSelection = [...prev, genreId];
        }
      }
      
      onGenreSelectionChange(newSelection);
      return newSelection;
    });
  };

  /**
   * Limpia todos los géneros seleccionados
   */
  const handleClear = () => {
    setSelectedGenreIds([]);
    setSearchTerm('');
    onGenreSelectionChange([]);
    onClear?.();
    setIsPopoverOpen(false);
  };

  /**
   * Selecciona géneros populares predefinidos
   */
  const selectPopularGenres = () => {
    // IDs de géneros populares: Acción, Drama, Comedia, Aventura, Ciencia ficción
    const popularGenreIds = [28, 18, 35, 12, 878].filter(id => 
      genres.some(genre => genre.id === id)
    ).slice(0, maxSelection);
    
    setSelectedGenreIds(popularGenreIds);
    onGenreSelectionChange(popularGenreIds);
  };

  // Efecto para sincronizar con props iniciales
  useEffect(() => {
    if (JSON.stringify(initialSelectedGenres) !== JSON.stringify(selectedGenreIds)) {
      setSelectedGenreIds(initialSelectedGenres);
    }
  }, [initialSelectedGenres]);

  const hasActiveFilter = selectedGenreIds.length > 0;

  return (
    <Card className="cinema-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {hasActiveFilter && (
              <Badge variant="secondary" className="ml-2">
                {selectedGenreIds.length} seleccionado{selectedGenreIds.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled || isLoading}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Botón de géneros populares */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={selectPopularGenres}
            disabled={disabled || isLoading}
            className="text-xs"
          >
            Géneros Populares
          </Button>
          <span className="text-xs text-muted-foreground">
            Máximo {maxSelection} géneros
          </span>
        </div>

        {/* Selector de géneros */}
        <div className="space-y-3">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPopoverOpen}
                className="w-full justify-between h-auto min-h-10 p-3"
                disabled={disabled || isLoading}
              >
                <div className="flex flex-wrap gap-1 flex-1">
                  {selectedGenres.length === 0 ? (
                    <span className="text-muted-foreground">Seleccionar géneros...</span>
                  ) : (
                    selectedGenres.map(genre => (
                      <Badge
                        key={genre.id}
                        variant="secondary"
                        className="text-xs cinema-glow"
                      >
                        {genre.name}
                      </Badge>
                    ))
                  )}
                </div>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="p-3 space-y-3">
                {/* Buscador de géneros */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar géneros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Lista de géneros */}
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {isLoading ? (
                    // Skeletons mientras carga
                    Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))
                  ) : filteredGenres.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      {searchTerm ? 'No se encontraron géneros' : 'No hay géneros disponibles'}
                    </div>
                  ) : (
                    filteredGenres.map(genre => {
                      const isSelected = selectedGenreIds.includes(genre.id);
                      const canSelect = selectedGenreIds.length < maxSelection || isSelected;
                      
                      return (
                        <Button
                          key={genre.id}
                          variant="ghost"
                          className={`w-full justify-start h-auto p-2 ${
                            isSelected ? 'bg-primary/10 text-primary' : ''
                          } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => canSelect && toggleGenre(genre.id)}
                          disabled={!canSelect}
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${
                              isSelected 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : 'border-muted-foreground'
                            }`}>
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                            <span className="text-sm">{genre.name}</span>
                          </div>
                        </Button>
                      );
                    })
                  )}
                </div>

                {/* Información de selección */}
                {selectedGenreIds.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{selectedGenreIds.length} de {maxSelection} géneros seleccionados</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="h-6 px-2 text-xs hover:text-destructive"
                      >
                        Limpiar todo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Géneros seleccionados como badges */}
        {selectedGenres.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Géneros Seleccionados:</Label>
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map(genre => (
                <Badge
                  key={genre.id}
                  variant="default"
                  className="cinema-glow cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
