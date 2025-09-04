/**
 * API Route para recibir webhooks de trazas HTTP
 * Endpoint para testing y monitoreo de logs
 */

import { NextRequest, NextResponse } from 'next/server';
import type { WebhookPayload, ApiResponse } from '@/lib/types';
import { logger } from '@/lib/utils/logger';

/**
 * POST /api/webhook
 * Recibe webhooks con trazas HTTP para monitoreo
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();

  try {
    // Verificar Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Content-Type debe ser application/json');
    }

    // Leer payload
    const payload: WebhookPayload = await request.json();

    // Validar estructura del payload
    if (!payload.event || !payload.trace) {
      throw new Error('Payload de webhook inválido');
    }

    // Log del webhook recibido
    console.log('Webhook recibido:', {
      event: payload.event,
      traceId: payload.trace.id,
      timestamp: payload.trace.timestamp,
      method: payload.trace.method,
      url: payload.trace.url,
      status: payload.trace.status,
      duration: payload.trace.duration,
    });

    // Aquí se podría enviar a un sistema de monitoreo externo
    // como DataDog, Sentry, New Relic, etc.
    if (payload.event === 'error') {
      console.error('Error detectado en traza:', {
        traceId: payload.trace.id,
        error: payload.trace.error,
        url: payload.trace.url,
        status: payload.trace.status,
      });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Webhook procesado exitosamente',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-Response-Time': `${Math.round(performance.now() - startTime)}ms`,
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const duration = Math.round(performance.now() - startTime);

    console.error('Error procesando webhook:', {
      error: errorMessage,
      url: request.url,
      duration,
    });

    const errorResponse: ApiResponse = {
      success: false,
      error: errorMessage,
      message: 'Error procesando webhook',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, {
      status: 400,
      headers: {
        'X-Response-Time': `${duration}ms`,
      },
    });
  }
}

/**
 * GET /api/webhook
 * Endpoint de health check para el webhook
 */
export async function GET(request: NextRequest) {
  const response: ApiResponse = {
    success: true,
    message: 'Webhook endpoint activo',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
}
