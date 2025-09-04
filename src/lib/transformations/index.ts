/**
 * INTEGRADOR PRINCIPAL DE TRANSFORMACIONES DE DATOS
 * 
 * Este archivo orquesta todas las transformaciones de datos del dashboard
 * y proporciona una interfaz unificada para procesamiento completo.
 */

import type { Movie, Genre, DashboardData, DashboardFilters } from '../types';

// Importar todas las transformaciones
import { aggregateByMonth, filterByDateRange } from './temporal-aggregation';
import { calculatePercentageChange } from './percentage-change';
import { calculateRollingAverage } from './rolling-window';
import { getTopMovies } from './top-movies';
import { analyzeGenreDistribution } from './genre-analysis';

/**
 * Función principal que ejecuta todas las transformaciones de datos
 * 
 * @param movies - Array de películas desde TMDB
 * @param genres - Array de géneros disponibles
 * @param filters - Filtros aplicados por el usuario
 * @returns Datos completamente transformados para el dashboard
 * 
 * @example
 * ```typescript
 * const dashboardData = transformDashboardData(movies, genres, filters);
 * console.log(dashboardData.monthly_data[0]);
 * console.log(dashboardData.top_movies[0]);
 * console.log(dashboardData.genre_distribution[0]);
 * ```
 */
export function transformDashboardData(
  movies: Movie[],
  genres: Genre[],
  filters: DashboardFilters
): DashboardData {
  console.log('🔄 Iniciando transformaciones de datos...');
  const startTime = performance.now();

  try {
    // TRANSFORMACIÓN 1: Agregación Temporal (Mensual)
    console.log('📊 Ejecutando agregación temporal...');
    let monthlyData = aggregateByMonth(movies, genres);
    
    // Filtrar por rango de fechas si se especifica
    if (filters.startDate && filters.endDate) {
      monthlyData = filterByDateRange(monthlyData, filters.startDate, filters.endDate);
    }

    // TRANSFORMACIÓN 2: Cálculo de Cambio Porcentual
    console.log('📈 Calculando cambios porcentuales...');
    monthlyData = calculatePercentageChange(monthlyData);

    // TRANSFORMACIÓN 3: Análisis de Ventana Móvil (3 períodos)
    console.log('📉 Aplicando promedio móvil...');
    monthlyData = calculateRollingAverage(monthlyData, 3);

    // TRANSFORMACIÓN 4: Filtrado Top-N de Películas
    console.log('🏆 Obteniendo top películas...');
    const topMovies = getTopMovies(movies, genres, 'popularity', 10);

    // TRANSFORMACIÓN 5: Unión de Nombres de Géneros y Distribución
    console.log('🎭 Analizando distribución de géneros...');
    const genreDistribution = analyzeGenreDistribution(movies, genres);

    // Calcular métricas adicionales
    const totalMovies = movies.length;
    const dateRange = {
      start: filters.startDate || getEarliestDate(movies),
      end: filters.endDate || getLatestDate(movies)
    };

    const transformedData: DashboardData = {
      monthly_data: monthlyData,
      top_movies: topMovies,
      genre_distribution: genreDistribution,
      total_movies: totalMovies,
      date_range: dateRange,
      filters_applied: filters
    };

    const duration = Math.round(performance.now() - startTime);
    console.log(`✅ Transformaciones completadas en ${duration}ms`);

    return transformedData;

  } catch (error) {
    console.error('❌ Error en transformaciones:', error);
    throw new Error(`Error transformando datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Función helper para obtener la fecha más temprana de las películas
 */
function getEarliestDate(movies: Movie[]): string {
  const validDates = movies
    .filter(movie => movie.release_date)
    .map(movie => movie.release_date)
    .sort();

  return validDates.length > 0 ? validDates[0] : new Date().toISOString().split('T')[0];
}

/**
 * Función helper para obtener la fecha más tardía de las películas
 */
function getLatestDate(movies: Movie[]): string {
  const validDates = movies
    .filter(movie => movie.release_date)
    .map(movie => movie.release_date)
    .sort()
    .reverse();

  return validDates.length > 0 ? validDates[0] : new Date().toISOString().split('T')[0];
}

/**
 * Función para validar la integridad de los datos transformados
 * 
 * @param data - Datos transformados del dashboard
 * @returns Resultado de la validación
 */
export function validateDashboardData(data: DashboardData): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validar datos mensuales
  if (!data.monthly_data || data.monthly_data.length === 0) {
    errors.push('No hay datos mensuales disponibles');
  } else {
    // Verificar que los datos estén ordenados cronológicamente
    const isOrdered = data.monthly_data.every((curr, index) => {
      if (index === 0) return true;
      return curr.month >= data.monthly_data[index - 1].month;
    });
    
    if (!isOrdered) {
      warnings.push('Los datos mensuales no están ordenados cronológicamente');
    }
  }

  // Validar top películas
  if (!data.top_movies || data.top_movies.length === 0) {
    warnings.push('No hay top películas disponibles');
  }

  // Validar distribución de géneros
  if (!data.genre_distribution || data.genre_distribution.length === 0) {
    warnings.push('No hay distribución de géneros disponible');
  } else {
    // Verificar que los porcentajes sumen aproximadamente 100%
    const totalPercentage = data.genre_distribution.reduce((sum, genre) => sum + genre.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 5) {
      warnings.push(`Los porcentajes de géneros no suman 100% (actual: ${totalPercentage.toFixed(2)}%)`);
    }
  }

  // Validar rango de fechas
  if (data.date_range.start > data.date_range.end) {
    errors.push('El rango de fechas es inválido (inicio > fin)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Función para obtener un resumen de las transformaciones aplicadas
 * 
 * @param data - Datos transformados del dashboard
 * @returns Resumen de las transformaciones
 */
export function getTransformationSummary(data: DashboardData): {
  totalMoviesProcessed: number;
  monthsAnalyzed: number;
  genresFound: number;
  topMoviesSelected: number;
  dateRangeCovered: string;
  transformationsApplied: string[];
} {
  return {
    totalMoviesProcessed: data.total_movies,
    monthsAnalyzed: data.monthly_data.length,
    genresFound: data.genre_distribution.length,
    topMoviesSelected: data.top_movies.length,
    dateRangeCovered: `${data.date_range.start} a ${data.date_range.end}`,
    transformationsApplied: [
      'Agregación Temporal Mensual',
      'Cálculo de Cambio Porcentual',
      'Promedio Móvil de 3 Períodos',
      'Filtrado Top-10 Películas',
      'Análisis de Distribución de Géneros'
    ]
  };
}

// Re-exportar todas las transformaciones individuales
export * from './temporal-aggregation';
export * from './percentage-change';
export * from './rolling-window';
export * from './top-movies';
export * from './genre-analysis';
