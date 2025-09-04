/**
 * TRANSFORMACIÓN 1: AGREGACIÓN TEMPORAL (MENSUAL)
 * 
 * Esta función toma un array de películas y las agrupa por mes,
 * calculando estadísticas promedio para cada período mensual.
 */

import type { Movie, Genre, MonthlyData } from '../types';

/**
 * Agrupa películas por mes y calcula estadísticas promedio
 * 
 * @param movies - Array de películas a procesar
 * @param genres - Array de géneros para unir nombres
 * @returns Array de datos mensuales agregados
 * 
 * @example
 * ```typescript
 * const monthlyStats = aggregateByMonth(movies, genres);
 * console.log(monthlyStats[0]); 
 * // { month: "2023-01", year: 2023, movies_count: 15, avg_popularity: 85.2, ... }
 * ```
 */
export function aggregateByMonth(movies: Movie[], genres: Genre[]): MonthlyData[] {
  // Paso 1: Filtrar películas con fecha válida
  const validMovies = movies.filter(movie => {
    return movie.release_date && 
           movie.release_date.length >= 10 && 
           !isNaN(Date.parse(movie.release_date));
  });

  // Paso 2: Agrupar películas por mes (formato YYYY-MM)
  const moviesByMonth = new Map<string, Movie[]>();

  validMovies.forEach(movie => {
    // Extraer año y mes de la fecha de lanzamiento
    const releaseDate = new Date(movie.release_date);
    const year = releaseDate.getFullYear();
    const month = (releaseDate.getMonth() + 1).toString().padStart(2, '0');
    const monthKey = `${year}-${month}`;

    // Agrupar película en su mes correspondiente
    if (!moviesByMonth.has(monthKey)) {
      moviesByMonth.set(monthKey, []);
    }
    moviesByMonth.get(monthKey)!.push(movie);
  });

  // Paso 3: Calcular estadísticas para cada mes
  const monthlyData: MonthlyData[] = [];

  moviesByMonth.forEach((moviesInMonth, monthKey) => {
    const [yearStr, monthStr] = monthKey.split('-');
    const year = parseInt(yearStr);
    const monthNum = parseInt(monthStr);

    // Calcular promedios para el mes
    const totalMovies = moviesInMonth.length;
    const totalPopularity = moviesInMonth.reduce((sum, movie) => sum + movie.popularity, 0);
    const totalVoteAverage = moviesInMonth.reduce((sum, movie) => sum + movie.vote_average, 0);
    const totalVoteCount = moviesInMonth.reduce((sum, movie) => sum + movie.vote_count, 0);

    // Crear objeto de datos mensuales
    const monthlyRecord: MonthlyData = {
      month: monthKey,
      year: year,
      movies_count: totalMovies,
      avg_popularity: Math.round((totalPopularity / totalMovies) * 100) / 100,
      avg_vote_average: Math.round((totalVoteAverage / totalMovies) * 100) / 100,
      total_vote_count: totalVoteCount,
    };

    monthlyData.push(monthlyRecord);
  });

  // Paso 4: Ordenar por fecha (más antiguos primero)
  return monthlyData.sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Función helper para obtener el nombre del mes en español
 * 
 * @param monthKey - Clave del mes en formato YYYY-MM
 * @returns Nombre del mes en español
 */
export function getMonthName(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const monthIndex = parseInt(month) - 1;
  return `${monthNames[monthIndex]} ${year}`;
}

/**
 * Función helper para filtrar datos por rango de fechas
 * 
 * @param monthlyData - Datos mensuales agregados
 * @param startDate - Fecha de inicio (YYYY-MM-DD)
 * @param endDate - Fecha de fin (YYYY-MM-DD)
 * @returns Datos filtrados por rango de fechas
 */
export function filterByDateRange(
  monthlyData: MonthlyData[], 
  startDate: string, 
  endDate: string
): MonthlyData[] {
  const start = startDate.substring(0, 7); // YYYY-MM
  const end = endDate.substring(0, 7);     // YYYY-MM

  return monthlyData.filter(data => {
    return data.month >= start && data.month <= end;
  });
}
