/**
 * Hook personalizado para manejar datos del dashboard de películas
 * 
 * Integra TanStack Query con nuestras APIs y transformaciones
 * Proporciona estado unificado para toda la aplicación
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchGenres, fetchMultipleMoviePages } from '@/lib/data/movie-client';
import { transformDashboardData } from '@/lib/transformations';
import type { DashboardFilters, DashboardData, Genre, Movie } from '@/lib/types';

/**
 * Filtros por defecto del dashboard
 */
const DEFAULT_FILTERS: DashboardFilters = {
  startDate: '',
  endDate: '',
  genres: [],
  sortBy: 'popularity.desc',
  minVoteCount: 100,
};

/**
 * Hook principal para datos del dashboard
 */
export function useDashboardData(initialFilters: Partial<DashboardFilters> = {}) {
  // Estado de filtros
  const [filters, setFilters] = useState<DashboardFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  // Query para géneros (cache largo)
  const {
    data: genres = [],
    isLoading: isLoadingGenres,
    error: genresError,
  } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 3,
  });

  // Query para películas (depende de filtros)
  const {
    data: movies = [],
    isLoading: isLoadingMovies,
    error: moviesError,
    refetch: refetchMovies,
  } = useQuery({
    queryKey: ['movies', filters],
    queryFn: () => fetchMultipleMoviePages(filters, 3),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    enabled: true, // Siempre habilitado
    retry: 2,
  });

  // Datos transformados del dashboard
  const dashboardData = useMemo((): DashboardData | null => {
    if (!movies.length || !genres.length) return null;

    try {
      return transformDashboardData(movies, genres, filters);
    } catch (error) {
      console.error('Error transformando datos del dashboard:', error);
      return null;
    }
  }, [movies, genres, filters]);

  // Estados derivados
  const isLoading = isLoadingGenres || isLoadingMovies;
  const hasError = !!genresError || !!moviesError;
  const errorMessage = genresError?.message || moviesError?.message || '';

  // Función para actualizar filtros
  const updateFilters = (newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Función para resetear filtros
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Función para aplicar filtros populares
  const applyPopularFilters = () => {
    const popularFilters: DashboardFilters = {
      startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      genres: [28, 12, 878, 35, 18], // Acción, Aventura, Sci-Fi, Comedia, Drama
      sortBy: 'popularity.desc',
      minVoteCount: 500,
    };
    setFilters(popularFilters);
  };

  // Estadísticas rápidas
  const stats = useMemo(() => {
    if (!dashboardData) return null;

    return {
      totalMovies: dashboardData.total_movies,
      monthsAnalyzed: dashboardData.monthly_data.length,
      genresFound: dashboardData.genre_distribution.length,
      topMoviesCount: dashboardData.top_movies.length,
      averagePopularity: dashboardData.monthly_data.length > 0
        ? Math.round(dashboardData.monthly_data.reduce((sum, month) => sum + month.avg_popularity, 0) / dashboardData.monthly_data.length)
        : 0,
      averageRating: dashboardData.monthly_data.length > 0
        ? Math.round((dashboardData.monthly_data.reduce((sum, month) => sum + month.avg_vote_average, 0) / dashboardData.monthly_data.length) * 10) / 10
        : 0,
    };
  }, [dashboardData]);

  return {
    // Datos
    genres,
    movies,
    dashboardData,
    stats,

    // Estados
    filters,
    isLoading,
    isLoadingGenres,
    isLoadingMovies,
    hasError,
    errorMessage,

    // Acciones
    updateFilters,
    resetFilters,
    applyPopularFilters,
    refetchMovies,
  };
}
