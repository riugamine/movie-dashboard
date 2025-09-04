/**
 * API Route para descubrimiento de películas de TMDB
 * Implementa filtros, paginación, caché y logging completo
 */

import { NextRequest, NextResponse } from 'next/server';
import type { TMDBResponse, Movie, DiscoverMoviesParams, ApiResponse } from '@/lib/types';
import { logger, measureTime } from '@/lib/utils/logger';
import { cache, CACHE_CONFIGS, generateCacheKey, cacheWithLoader } from '@/lib/utils/cache';

/**
 * GET /api/movies/discover
 * Descubre películas según filtros especificados
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();
  const { searchParams } = new URL(request.url);

  try {
    // Extraer y validar parámetros
    const params: DiscoverMoviesParams = {
      page: Math.min(parseInt(searchParams.get('page') || '1'), 3), // Límite de 3 páginas
      include_adult: false,
      include_video: false,
      language: 'es-ES',
      primary_release_date_gte: searchParams.get('start_date') || undefined,
      primary_release_date_lte: searchParams.get('end_date') || undefined,
      sort_by: (searchParams.get('sort_by') as any) || 'popularity.desc',
      vote_count_gte: parseInt(searchParams.get('min_vote_count') || '100'),
      with_genres: searchParams.get('genres') || undefined,
    };

    // Limpiar parámetros undefined
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    const { result: movies, duration } = await measureTime(async () => {
      const cacheKey = generateCacheKey('tmdb:movies:discover', cleanParams);
      
      return await cacheWithLoader(
        cacheKey,
        {
          ...CACHE_CONFIGS.MOVIES_DISCOVER,
          key: cacheKey,
        },
        async () => {
          // Construir URL de TMDB
          const tmdbUrl = new URL(`${process.env.TMDB_BASE_URL}/discover/movie`);
          tmdbUrl.searchParams.set('api_key', process.env.TMDB_API_KEY!);
          
          // Agregar parámetros
          Object.entries(cleanParams).forEach(([key, value]) => {
            tmdbUrl.searchParams.set(key, value.toString());
          });

          const tmdbResponse = await fetch(tmdbUrl.toString(), {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'MovieDashboard/1.0.0',
            },
            next: { revalidate: 300 }, // 5 minutos
          });

          if (!tmdbResponse.ok) {
            throw new Error(`TMDB API error: ${tmdbResponse.status} ${tmdbResponse.statusText}`);
          }

          const data: TMDBResponse<Movie> = await tmdbResponse.json();
          
          // Filtrar películas sin poster o con datos incompletos
          const filteredMovies = data.results.filter(movie => 
            movie.poster_path && 
            movie.title && 
            movie.release_date &&
            movie.vote_count >= (cleanParams.vote_count_gte || 0)
          );

          return {
            ...data,
            results: filteredMovies,
          };
        }
      );
    });

    // Log de la traza HTTP
    await logger.logHttpTrace(
      'GET',
      request.url,
      200,
      duration,
      0,
      JSON.stringify(movies).length,
      {
        userAgent: request.headers.get('user-agent') || undefined,
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown',
        params: cleanParams,
      }
    );

    const response: ApiResponse<typeof movies> = {
      success: true,
      data: movies,
      message: `${movies.results.length} películas encontradas`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150',
        'X-Response-Time': `${Math.round(performance.now() - startTime)}ms`,
        'X-Total-Results': movies.total_results.toString(),
        'X-Page': movies.page.toString(),
        'X-Total-Pages': movies.total_pages.toString(),
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const duration = Math.round(performance.now() - startTime);

    // Log del error
    await logger.logHttpTrace(
      'GET',
      request.url,
      500,
      duration,
      0,
      0,
      {
        userAgent: request.headers.get('user-agent') || undefined,
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown',
        error: errorMessage,
        params: Object.fromEntries(searchParams),
      }
    );

    const errorResponse: ApiResponse = {
      success: false,
      error: errorMessage,
      message: 'Error al descubrir películas',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        'X-Response-Time': `${duration}ms`,
      },
    });
  }
}

/**
 * Función helper para validar parámetros de fecha
 */
function validateDateRange(startDate?: string, endDate?: string): boolean {
  if (!startDate || !endDate) return true;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start <= end && start >= new Date('1900-01-01') && end <= new Date();
}
