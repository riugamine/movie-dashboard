/**
 * Cliente para consumir las APIs de películas desde el frontend
 * Implementa TanStack Query y manejo de errores robusto
 */

import type { 
  TMDBResponse, 
  Movie, 
  Genre, 
  MovieDetails, 
  ApiResponse,
  DashboardFilters 
} from '../types';

/**
 * Configuración base para las llamadas a la API
 */
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  timeout: 30000, // 30 segundos
  retries: 3,
} as const;

/**
 * Función helper para realizar llamadas HTTP con manejo de errores
 */
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
    signal: AbortSignal.timeout(API_CONFIG.timeout),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data: ApiResponse<T> = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error desconocido en la API');
  }

  return data;
}

/**
 * Obtiene la lista de géneros de películas
 * 
 * @returns Promise con la lista de géneros
 */
export async function fetchGenres(): Promise<Genre[]> {
  console.log('🎭 Obteniendo géneros...');
  
  try {
    const response = await apiCall<Genre[]>('/api/genres');
    console.log(`✅ ${response.data?.length || 0} géneros obtenidos`);
    return response.data || [];
  } catch (error) {
    console.error('❌ Error obteniendo géneros:', error);
    throw error;
  }
}

/**
 * Descubre películas según filtros especificados
 * 
 * @param filters - Filtros de búsqueda
 * @param page - Página a obtener (default: 1)
 * @returns Promise con películas encontradas
 */
export async function fetchMovies(
  filters: Partial<DashboardFilters> = {},
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  console.log('🎬 Descubriendo películas...', { filters, page });
  
  try {
    // Construir parámetros de consulta
    const searchParams = new URLSearchParams();
    searchParams.set('page', page.toString());
    
    if (filters.startDate) searchParams.set('start_date', filters.startDate);
    if (filters.endDate) searchParams.set('end_date', filters.endDate);
    if (filters.genres && filters.genres.length > 0) {
      searchParams.set('genres', filters.genres.join(','));
    }
    if (filters.sortBy) searchParams.set('sort_by', filters.sortBy);
    if (filters.minVoteCount) searchParams.set('min_vote_count', filters.minVoteCount.toString());

    const endpoint = `/api/movies/discover?${searchParams.toString()}`;
    const response = await apiCall<TMDBResponse<Movie>>(endpoint);
    
    console.log(`✅ ${response.data?.results.length || 0} películas encontradas`);
    return response.data || { page: 1, results: [], total_pages: 0, total_results: 0 };
  } catch (error) {
    console.error('❌ Error descubriendo películas:', error);
    throw error;
  }
}

/**
 * Obtiene múltiples páginas de películas
 * 
 * @param filters - Filtros de búsqueda
 * @param maxPages - Máximo número de páginas a obtener (default: 3)
 * @returns Promise con todas las películas obtenidas
 */
export async function fetchMultipleMoviePages(
  filters: Partial<DashboardFilters> = {},
  maxPages: number = 3
): Promise<Movie[]> {
  console.log(`🎬 Obteniendo múltiples páginas (máx: ${maxPages})...`);
  
  try {
    const allMovies: Movie[] = [];
    
    // Obtener primera página para conocer el total
    const firstPage = await fetchMovies(filters, 1);
    allMovies.push(...firstPage.results);
    
    // Calcular páginas adicionales a obtener
    const totalPages = Math.min(firstPage.total_pages, maxPages);
    const additionalPages = [];
    
    for (let page = 2; page <= totalPages; page++) {
      additionalPages.push(fetchMovies(filters, page));
    }
    
    // Obtener páginas adicionales en paralelo
    if (additionalPages.length > 0) {
      const results = await Promise.all(additionalPages);
      results.forEach(result => {
        allMovies.push(...result.results);
      });
    }
    
    console.log(`✅ Total de ${allMovies.length} películas obtenidas de ${totalPages} páginas`);
    return allMovies;
  } catch (error) {
    console.error('❌ Error obteniendo múltiples páginas:', error);
    throw error;
  }
}

/**
 * Obtiene detalles de una película específica
 * 
 * @param movieId - ID de la película
 * @returns Promise con detalles completos de la película
 */
export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  console.log(`🎬 Obteniendo detalles de película ${movieId}...`);
  
  try {
    const response = await apiCall<MovieDetails>(`/api/movies/${movieId}`);
    console.log(`✅ Detalles de "${response.data?.title}" obtenidos`);
    return response.data!;
  } catch (error) {
    console.error(`❌ Error obteniendo detalles de película ${movieId}:`, error);
    throw error;
  }
}

/**
 * Obtiene datos mock para testing offline
 * 
 * @param filters - Filtros de búsqueda
 * @returns Promise con datos mock
 */
export async function fetchMockMovies(
  filters: Partial<DashboardFilters> = {}
): Promise<TMDBResponse<Movie>> {
  console.log('🎭 Obteniendo datos mock...');
  
  try {
    const searchParams = new URLSearchParams();
    if (filters.genres && filters.genres.length > 0) {
      searchParams.set('genres', filters.genres.join(','));
    }

    const endpoint = `/api/mock/movies?${searchParams.toString()}`;
    const response = await apiCall<TMDBResponse<Movie>>(endpoint);
    
    console.log(`✅ ${response.data?.results.length || 0} películas mock obtenidas`);
    return response.data || { page: 1, results: [], total_pages: 0, total_results: 0 };
  } catch (error) {
    console.error('❌ Error obteniendo datos mock:', error);
    throw error;
  }
}

/**
 * Función helper para construir URL de imagen de TMDB
 * 
 * @param path - Ruta de la imagen
 * @param size - Tamaño deseado (default: 'w500')
 * @returns URL completa de la imagen
 */
export function buildImageUrl(path: string | null, size: string = 'w500'): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Función helper para formatear fecha de lanzamiento
 * 
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada en español
 */
export function formatReleaseDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Función helper para obtener el año de lanzamiento
 * 
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns Año como número
 */
export function getReleaseYear(dateString: string): number {
  try {
    return new Date(dateString).getFullYear();
  } catch {
    return 0;
  }
}
