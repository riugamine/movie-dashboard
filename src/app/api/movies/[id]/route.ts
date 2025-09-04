/**
 * API Route para obtener detalles de una película específica
 * Implementa caché de 30 minutos y logging completo
 */

import { NextRequest, NextResponse } from 'next/server';
import type { MovieDetails, ApiResponse } from '@/lib/types';
import { logger, measureTime } from '@/lib/utils/logger';
import { cache, CACHE_CONFIGS, generateCacheKey, cacheWithLoader } from '@/lib/utils/cache';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/movies/[id]
 * Obtiene detalles completos de una película específica
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const startTime = performance.now();
  const { id: movieId } = await params;

  try {
    // Validar ID de película
    if (!movieId || isNaN(parseInt(movieId))) {
      throw new Error('ID de película inválido');
    }

    const { result: movieDetails, duration } = await measureTime(async () => {
      const cacheKey = generateCacheKey('tmdb:movie:details', { id: movieId });
      
      return await cacheWithLoader(
        cacheKey,
        {
          ttl: CACHE_CONFIGS.MOVIE_DETAILS.ttl,
          key: cacheKey,
          tags: ['tmdb', 'movie', 'details'],
        },
        async () => {
          const tmdbResponse = await fetch(
            `${process.env.TMDB_BASE_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=es-ES&append_to_response=credits,videos,similar`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'MovieDashboard/1.0.0',
              },
              next: { revalidate: 1800 }, // 30 minutos
            }
          );

          if (!tmdbResponse.ok) {
            if (tmdbResponse.status === 404) {
              throw new Error('Película no encontrada');
            }
            throw new Error(`TMDB API error: ${tmdbResponse.status} ${tmdbResponse.statusText}`);
          }

          const data: MovieDetails = await tmdbResponse.json();
          
          // Validar que la película tenga datos mínimos requeridos
          if (!data.title || !data.id) {
            throw new Error('Datos de película incompletos');
          }

          return data;
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
      JSON.stringify(movieDetails).length,
      {
        userAgent: request.headers.get('user-agent') || undefined,
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown',
        params: { movieId },
      }
    );

    const response: ApiResponse<MovieDetails> = {
      success: true,
      data: movieDetails,
      message: 'Detalles de película obtenidos exitosamente',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900',
        'X-Response-Time': `${Math.round(performance.now() - startTime)}ms`,
        'X-Movie-ID': movieId,
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const duration = Math.round(performance.now() - startTime);
    const statusCode = errorMessage === 'Película no encontrada' ? 404 : 
                      errorMessage === 'ID de película inválido' ? 400 : 500;

    // Log del error
    await logger.logHttpTrace(
      'GET',
      request.url,
      statusCode,
      duration,
      0,
      0,
      {
        userAgent: request.headers.get('user-agent') || undefined,
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown',
        error: errorMessage,
        params: { movieId },
      }
    );

    const errorResponse: ApiResponse = {
      success: false,
      error: errorMessage,
      message: 'Error al obtener detalles de película',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, {
      status: statusCode,
      headers: {
        'X-Response-Time': `${duration}ms`,
      },
    });
  }
}
