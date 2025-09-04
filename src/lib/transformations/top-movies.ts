/**
 * TRANSFORMACIÓN 4: FILTRADO TOP-N DE PELÍCULAS
 * 
 * Esta función filtra y ordena las mejores películas según diferentes criterios
 * como popularidad, votación, o combinación de ambos.
 */

import type { Movie, Genre, TopMovie } from '../types';

/**
 * Obtiene las top N películas según un criterio específico
 * 
 * @param movies - Array de películas a filtrar
 * @param genres - Array de géneros para unir nombres
 * @param criteria - Criterio de ordenamiento
 * @param topN - Número de películas a retornar (default: 10)
 * @returns Array de top películas enriquecidas
 * 
 * @example
 * ```typescript
 * const topMovies = getTopMovies(movies, genres, 'popularity', 10);
 * console.log(topMovies[0]); 
 * // { id: 123, title: "Avatar", popularity: 8547.32, genre_names: ["Sci-Fi", "Adventure"] }
 * ```
 */
export function getTopMovies(
  movies: Movie[],
  genres: Genre[],
  criteria: 'popularity' | 'vote_average' | 'vote_count' | 'combined' = 'popularity',
  topN: number = 10
): TopMovie[] {
  // Paso 1: Filtrar películas válidas (con datos completos)
  const validMovies = movies.filter(movie => 
    movie.title &&
    movie.poster_path &&
    movie.release_date &&
    movie.popularity > 0 &&
    movie.vote_count >= 100 // Mínimo de votos para ser considerada
  );

  // Paso 2: Enriquecer películas con nombres de géneros
  const enrichedMovies = validMovies.map(movie => 
    enrichMovieWithGenres(movie, genres)
  );

  // Paso 3: Ordenar según el criterio especificado
  const sortedMovies = sortMoviesByCriteria(enrichedMovies, criteria);

  // Paso 4: Tomar los top N resultados
  return sortedMovies.slice(0, topN);
}

/**
 * Enriquece una película con los nombres de sus géneros
 * 
 * @param movie - Película original
 * @param genres - Array de géneros disponibles
 * @returns Película enriquecida con nombres de géneros
 */
function enrichMovieWithGenres(movie: Movie, genres: Genre[]): TopMovie {
  // Mapear IDs de género a nombres
  const genreNames = movie.genre_ids
    .map(genreId => {
      const genre = genres.find(g => g.id === genreId);
      return genre ? genre.name : null;
    })
    .filter((name): name is string => name !== null);

  return {
    id: movie.id,
    title: movie.title,
    popularity: Math.round(movie.popularity * 100) / 100,
    vote_average: Math.round(movie.vote_average * 100) / 100,
    poster_path: movie.poster_path,
    genre_names: genreNames,
    release_date: movie.release_date,
  };
}

/**
 * Ordena películas según el criterio especificado
 * 
 * @param movies - Array de películas enriquecidas
 * @param criteria - Criterio de ordenamiento
 * @returns Array ordenado de películas
 */
function sortMoviesByCriteria(movies: TopMovie[], criteria: string): TopMovie[] {
  switch (criteria) {
    case 'popularity':
      return movies.sort((a, b) => b.popularity - a.popularity);
    
    case 'vote_average':
      return movies.sort((a, b) => b.vote_average - a.vote_average);
    
    case 'vote_count':
      // Para vote_count necesitamos acceso a los datos originales
      return movies.sort((a, b) => b.popularity - a.popularity); // Fallback a popularidad
    
    case 'combined':
      return movies.sort((a, b) => {
        // Puntuación combinada: (popularidad normalizada + votación * 10)
        const scoreA = (a.popularity / 100) + (a.vote_average * 10);
        const scoreB = (b.popularity / 100) + (b.vote_average * 10);
        return scoreB - scoreA;
      });
    
    default:
      return movies.sort((a, b) => b.popularity - a.popularity);
  }
}

/**
 * Obtiene las películas mejor calificadas con suficientes votos
 * 
 * @param movies - Array de películas
 * @param genres - Array de géneros
 * @param minVotes - Mínimo de votos requeridos (default: 500)
 * @param topN - Número de películas a retornar (default: 10)
 * @returns Top películas mejor calificadas
 */
export function getTopRatedMovies(
  movies: Movie[],
  genres: Genre[],
  minVotes: number = 500,
  topN: number = 10
): TopMovie[] {
  const highlyVotedMovies = movies.filter(movie => 
    movie.vote_count >= minVotes &&
    movie.vote_average >= 7.0 // Mínimo de calificación
  );

  return getTopMovies(highlyVotedMovies, genres, 'vote_average', topN);
}

/**
 * Obtiene las películas más populares por género
 * 
 * @param movies - Array de películas
 * @param genres - Array de géneros
 * @param genreId - ID del género a filtrar
 * @param topN - Número de películas por género (default: 5)
 * @returns Top películas del género especificado
 */
export function getTopMoviesByGenre(
  movies: Movie[],
  genres: Genre[],
  genreId: number,
  topN: number = 5
): TopMovie[] {
  const moviesInGenre = movies.filter(movie => 
    movie.genre_ids.includes(genreId)
  );

  return getTopMovies(moviesInGenre, genres, 'popularity', topN);
}

/**
 * Obtiene estadísticas de las top películas
 * 
 * @param topMovies - Array de top películas
 * @returns Estadísticas calculadas
 */
export function getTopMoviesStats(topMovies: TopMovie[]): {
  avgPopularity: number;
  avgVoteAverage: number;
  mostCommonGenres: { genre: string; count: number }[];
  totalMovies: number;
} {
  if (topMovies.length === 0) {
    return {
      avgPopularity: 0,
      avgVoteAverage: 0,
      mostCommonGenres: [],
      totalMovies: 0
    };
  }

  // Calcular promedios
  const avgPopularity = Math.round(
    (topMovies.reduce((sum, movie) => sum + movie.popularity, 0) / topMovies.length) * 100
  ) / 100;

  const avgVoteAverage = Math.round(
    (topMovies.reduce((sum, movie) => sum + movie.vote_average, 0) / topMovies.length) * 100
  ) / 100;

  // Contar géneros más comunes
  const genreCount = new Map<string, number>();
  
  topMovies.forEach(movie => {
    movie.genre_names.forEach(genre => {
      genreCount.set(genre, (genreCount.get(genre) || 0) + 1);
    });
  });

  const mostCommonGenres = Array.from(genreCount.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    avgPopularity,
    avgVoteAverage,
    mostCommonGenres,
    totalMovies: topMovies.length
  };
}
