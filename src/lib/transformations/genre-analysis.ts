/**
 * TRANSFORMACIÓN 5: UNIÓN DE NOMBRES DE GÉNEROS Y ANÁLISIS
 * 
 * Esta función une los IDs de género con sus nombres correspondientes
 * y realiza análisis de distribución por género.
 */

import type { Movie, Genre, GenreDistribution } from '../types';

/**
 * Une películas con nombres de géneros y calcula distribución
 * 
 * @param movies - Array de películas
 * @param genres - Array de géneros disponibles
 * @returns Distribución detallada por género
 * 
 * @example
 * ```typescript
 * const distribution = analyzeGenreDistribution(movies, genres);
 * console.log(distribution[0]); 
 * // { genre_id: 28, genre_name: "Acción", count: 45, percentage: 22.5, avg_popularity: 85.2 }
 * ```
 */
export function analyzeGenreDistribution(
  movies: Movie[], 
  genres: Genre[]
): GenreDistribution[] {
  // Paso 1: Crear mapa de géneros para búsqueda rápida
  const genreMap = new Map<number, string>();
  genres.forEach(genre => {
    genreMap.set(genre.id, genre.name);
  });

  // Paso 2: Contar películas y acumular métricas por género
  const genreStats = new Map<number, {
    count: number;
    totalPopularity: number;
    totalVoteAverage: number;
    totalVoteCount: number;
  }>();

  // Inicializar estadísticas para todos los géneros
  genres.forEach(genre => {
    genreStats.set(genre.id, {
      count: 0,
      totalPopularity: 0,
      totalVoteAverage: 0,
      totalVoteCount: 0
    });
  });

  // Procesar cada película
  movies.forEach(movie => {
    // Validar que la película tiene datos completos
    if (!movie.genre_ids || movie.genre_ids.length === 0) return;

    // Procesar cada género de la película
    movie.genre_ids.forEach(genreId => {
      const stats = genreStats.get(genreId);
      if (stats) {
        stats.count += 1;
        stats.totalPopularity += movie.popularity;
        stats.totalVoteAverage += movie.vote_average;
        stats.totalVoteCount += movie.vote_count;
      }
    });
  });

  // Paso 3: Calcular el total de películas para porcentajes
  const totalMovies = movies.length;

  // Paso 4: Convertir estadísticas a distribución final
  const distribution: GenreDistribution[] = [];

  genreStats.forEach((stats, genreId) => {
    const genreName = genreMap.get(genreId) || `Género ${genreId}`;
    
    // Solo incluir géneros que tienen al menos una película
    if (stats.count > 0) {
      distribution.push({
        genre_id: genreId,
        genre_name: genreName,
        count: stats.count,
        percentage: Math.round((stats.count / totalMovies) * 10000) / 100, // 2 decimales
        avg_popularity: Math.round((stats.totalPopularity / stats.count) * 100) / 100,
        avg_vote_average: Math.round((stats.totalVoteAverage / stats.count) * 100) / 100,
      });
    }
  });

  // Paso 5: Ordenar por número de películas (descendente)
  return distribution.sort((a, b) => b.count - a.count);
}

/**
 * Obtiene los géneros más populares
 * 
 * @param distribution - Distribución por género
 * @param topN - Número de géneros a retornar (default: 5)
 * @returns Top géneros por número de películas
 */
export function getTopGenres(
  distribution: GenreDistribution[], 
  topN: number = 5
): GenreDistribution[] {
  return distribution
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/**
 * Obtiene los géneros con mayor popularidad promedio
 * 
 * @param distribution - Distribución por género
 * @param minMovies - Mínimo de películas para considerar el género (default: 3)
 * @param topN - Número de géneros a retornar (default: 5)
 * @returns Géneros ordenados por popularidad promedio
 */
export function getGenresByPopularity(
  distribution: GenreDistribution[],
  minMovies: number = 3,
  topN: number = 5
): GenreDistribution[] {
  return distribution
    .filter(genre => genre.count >= minMovies)
    .sort((a, b) => b.avg_popularity - a.avg_popularity)
    .slice(0, topN);
}

/**
 * Obtiene los géneros mejor calificados
 * 
 * @param distribution - Distribución por género
 * @param minMovies - Mínimo de películas para considerar el género (default: 5)
 * @param topN - Número de géneros a retornar (default: 5)
 * @returns Géneros ordenados por votación promedio
 */
export function getTopRatedGenres(
  distribution: GenreDistribution[],
  minMovies: number = 5,
  topN: number = 5
): GenreDistribution[] {
  return distribution
    .filter(genre => genre.count >= minMovies)
    .sort((a, b) => b.avg_vote_average - a.avg_vote_average)
    .slice(0, topN);
}

/**
 * Enriquece películas individuales con nombres de géneros
 * 
 * @param movies - Array de películas
 * @param genres - Array de géneros disponibles
 * @returns Películas con nombres de géneros añadidos
 */
export function enrichMoviesWithGenreNames(
  movies: Movie[], 
  genres: Genre[]
): Array<Movie & { genre_names: string[] }> {
  // Crear mapa de géneros para búsqueda rápida
  const genreMap = new Map<number, string>();
  genres.forEach(genre => {
    genreMap.set(genre.id, genre.name);
  });

  // Enriquecer cada película
  return movies.map(movie => ({
    ...movie,
    genre_names: movie.genre_ids
      .map(genreId => genreMap.get(genreId))
      .filter((name): name is string => name !== undefined)
  }));
}

/**
 * Obtiene estadísticas generales de géneros
 * 
 * @param distribution - Distribución por género
 * @returns Estadísticas resumidas
 */
export function getGenreStats(distribution: GenreDistribution[]): {
  totalGenres: number;
  avgMoviesPerGenre: number;
  mostPopularGenre: GenreDistribution | null;
  leastPopularGenre: GenreDistribution | null;
  genreWithHighestRating: GenreDistribution | null;
} {
  if (distribution.length === 0) {
    return {
      totalGenres: 0,
      avgMoviesPerGenre: 0,
      mostPopularGenre: null,
      leastPopularGenre: null,
      genreWithHighestRating: null
    };
  }

  // Calcular promedio de películas por género
  const totalMoviesAcrossGenres = distribution.reduce((sum, genre) => sum + genre.count, 0);
  const avgMoviesPerGenre = Math.round((totalMoviesAcrossGenres / distribution.length) * 100) / 100;

  // Encontrar géneros destacados
  const mostPopularGenre = distribution.reduce((max, genre) => 
    genre.count > max.count ? genre : max
  );

  const leastPopularGenre = distribution.reduce((min, genre) => 
    genre.count < min.count ? genre : min
  );

  const genreWithHighestRating = distribution.reduce((max, genre) => 
    genre.avg_vote_average > max.avg_vote_average ? genre : max
  );

  return {
    totalGenres: distribution.length,
    avgMoviesPerGenre,
    mostPopularGenre,
    leastPopularGenre,
    genreWithHighestRating
  };
}

/**
 * Filtra géneros por criterios específicos
 * 
 * @param distribution - Distribución por género
 * @param filters - Criterios de filtrado
 * @returns Géneros filtrados
 */
export function filterGenres(
  distribution: GenreDistribution[],
  filters: {
    minCount?: number;
    maxCount?: number;
    minPopularity?: number;
    minRating?: number;
    genreNames?: string[];
  }
): GenreDistribution[] {
  return distribution.filter(genre => {
    // Filtrar por número mínimo de películas
    if (filters.minCount && genre.count < filters.minCount) return false;
    
    // Filtrar por número máximo de películas
    if (filters.maxCount && genre.count > filters.maxCount) return false;
    
    // Filtrar por popularidad mínima
    if (filters.minPopularity && genre.avg_popularity < filters.minPopularity) return false;
    
    // Filtrar por calificación mínima
    if (filters.minRating && genre.avg_vote_average < filters.minRating) return false;
    
    // Filtrar por nombres específicos
    if (filters.genreNames && !filters.genreNames.includes(genre.genre_name)) return false;
    
    return true;
  });
}
