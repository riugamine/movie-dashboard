/**
 * API Route para obtener géneros de películas de TMDB
 * Implementa caché de 10 minutos y logging completo
 */

import { NextRequest, NextResponse } from 'next/server';
import type { GenresResponse, ApiResponse } from '@/lib/types';
import { logger, measureTime } from '@/lib/utils/logger';
import { cache, CACHE_CONFIGS, cacheWithLoader } from '@/lib/utils/cache';

/**
 * GET /api/genres
 * Obtiene la lista de géneros de películas desde TMDB
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { result: genres, duration } = await measureTime(async () => {
      return await cacheWithLoader(
        CACHE_CONFIGS.GENRES.key,
        CACHE_CONFIGS.GENRES,
        async () => {
          const tmdbResponse = await fetch(
            `${process.env.TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=es-ES`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'MovieDashboard/1.0.0',
              },
              next: { revalidate: 600 }, // 10 minutos
            }
          );

          if (!tmdbResponse.ok) {
            throw new Error(`TMDB API error: ${tmdbResponse.status} ${tmdbResponse.statusText}`);
          }

          const data: GenresResponse = await tmdbResponse.json();
          return data.genres;
        }
      );
    });

    // Log de la traza HTTP
    await logger.logHttpTrace(
      'GET',
      request.url,
      200,
      duration,
      0, // No hay payload en GET
      JSON.stringify(genres).length,
      {
        userAgent: request.headers.get('user-agent') || undefined,
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown',
      }
    );

    const response: ApiResponse<typeof genres> = {
      success: true,
      data: genres,
      message: 'Géneros obtenidos exitosamente',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
        'X-Response-Time': `${Math.round(performance.now() - startTime)}ms`,
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
      }
    );

    const errorResponse: ApiResponse = {
      success: false,
      error: errorMessage,
      message: 'Error al obtener géneros',
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
