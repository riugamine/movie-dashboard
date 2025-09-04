/**
 * Tipos para el dashboard y transformaciones de datos
 */

import { Movie, Genre } from './tmdb';

// Filtros del dashboard
export interface DashboardFilters {
  startDate: string;
  endDate: string;
  genres: number[];
  sortBy: 'popularity.desc' | 'popularity.asc' | 'vote_average.desc' | 'vote_average.asc' | 'release_date.desc' | 'release_date.asc';
  minVoteCount: number;
}

// Película enriquecida con géneros
export interface EnrichedMovie extends Movie {
  genre_names: string[];
  release_month: string;
  release_year: number;
}

// Datos agregados por mes
export interface MonthlyData {
  month: string;
  year: number;
  movies_count: number;
  avg_popularity: number;
  avg_vote_average: number;
  total_vote_count: number;
  popularity_change_percent?: number;
  vote_change_percent?: number;
  popularity_moving_avg?: number;
  vote_moving_avg?: number;
}

// Top películas por popularidad
export interface TopMovie {
  id: number;
  title: string;
  popularity: number;
  vote_average: number;
  poster_path: string | null;
  genre_names: string[];
  release_date: string;
}

// Distribución por género
export interface GenreDistribution {
  genre_id: number;
  genre_name: string;
  count: number;
  percentage: number;
  avg_popularity: number;
  avg_vote_average: number;
}

// Datos transformados para visualizaciones
export interface DashboardData {
  monthly_data: MonthlyData[];
  top_movies: TopMovie[];
  genre_distribution: GenreDistribution[];
  total_movies: number;
  date_range: {
    start: string;
    end: string;
  };
  filters_applied: DashboardFilters;
}

// Estados de carga
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  progress?: number;
}

// Configuración de gráficos
export interface ChartConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
  responsive: boolean;
  animation: boolean;
}

// Punto de datos para gráficos de línea
export interface LineChartData {
  month: string;
  value: number;
  change?: number;
  movingAvg?: number;
}

// Punto de datos para gráfico de barras
export interface BarChartData {
  name: string;
  value: number;
  color?: string;
  metadata?: any;
}

// Punto de datos para gráfico de dona
export interface DonutChartData {
  name: string;
  value: number;
  percentage: number;
  color?: string;
}
