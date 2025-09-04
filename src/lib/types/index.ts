/**
 * Archivo de exportación principal para todos los tipos
 */

// Tipos de TMDB
export type {
  TMDBResponse,
  Genre,
  GenresResponse,
  Movie,
  MovieDetails,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  DiscoverMoviesParams,
  TMDBConfiguration,
} from './tmdb';

// Tipos del dashboard
export type {
  DashboardFilters,
  EnrichedMovie,
  MonthlyData,
  TopMovie,
  GenreDistribution,
  DashboardData,
  LoadingState,
  ChartConfig,
  LineChartData,
  BarChartData,
  DonutChartData,
} from './dashboard';

// Tipos de API
export type {
  ApiResponse,
  ApiError,
  HttpTrace,
  WebhookConfig,
  WebhookPayload,
  CacheConfig,
  CacheEntry,
  PaginationParams,
  PaginatedResponse,
  RateLimitConfig,
  RateLimitState,
  ApiMetrics,
  ServerConfig,
} from './api';
