/**
 * API Route para obtener trazas de logs HTTP
 * Solo para desarrollo y debugging
 */

import { NextRequest, NextResponse } from 'next/server';
import type { HttpTrace, ApiResponse } from '@/lib/types';
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/logs
 * Obtiene las trazas HTTP recientes para debugging
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  // Solo permitir en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        success: false,
        error: 'Endpoint no disponible en producción',
        timestamp: new Date().toISOString(),
      },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

    const traces = await logger.getRecentTraces(limit);

    const response: ApiResponse<HttpTrace[]> = {
      success: true,
      data: traces,
      message: `${traces.length} trazas obtenidas`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
        'X-Response-Time': `${Math.round(performance.now() - startTime)}ms`,
        'X-Total-Traces': traces.length.toString(),
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const duration = Math.round(performance.now() - startTime);

    const errorResponse: ApiResponse = {
      success: false,
      error: errorMessage,
      message: 'Error al obtener trazas',
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
 * DELETE /api/logs
 * Limpia las trazas antiguas
 */
export async function DELETE(request: NextRequest) {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        success: false,
        error: 'Endpoint no disponible en producción',
        timestamp: new Date().toISOString(),
      },
      { status: 403 }
    );
  }

  try {
    await logger.cleanOldLogs();

    const response: ApiResponse = {
      success: true,
      message: 'Logs antiguos limpiados exitosamente',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

    const errorResponse: ApiResponse = {
      success: false,
      error: errorMessage,
      message: 'Error al limpiar logs',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, {
      status: 500,
    });
  }
}
