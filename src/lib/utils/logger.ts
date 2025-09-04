/**
 * Sistema de logging para trazas HTTP y webhooks
 */

import { writeFile, appendFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { HttpTrace, WebhookPayload } from '../types';

class Logger {
  private logDir: string;
  private traceFile: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'server', 'logs');
    this.traceFile = path.join(this.logDir, 'http_trace.jsonl');
  }

  /**
   * Inicializa el directorio de logs si no existe
   */
  private async ensureLogDir(): Promise<void> {
    if (!existsSync(this.logDir)) {
      await mkdir(this.logDir, { recursive: true });
    }
  }

  /**
   * Genera un ID único para la traza
   */
  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Registra una traza HTTP
   */
  async logHttpTrace(
    method: string,
    url: string,
    status: number,
    duration: number,
    payloadSize: number,
    responseSize: number,
    options: {
      userAgent?: string;
      ip?: string;
      params?: Record<string, any>;
      headers?: Record<string, string>;
      error?: string;
    } = {}
  ): Promise<HttpTrace> {
    await this.ensureLogDir();

    const trace: HttpTrace = {
      id: this.generateTraceId(),
      timestamp: new Date().toISOString(),
      method,
      url,
      baseUrl: new URL(url).origin,
      status,
      duration,
      payloadSize,
      responseSize,
      ...options,
    };

    try {
      // Escribir al archivo JSONL
      const logLine = JSON.stringify(trace) + '\n';
      await appendFile(this.traceFile, logLine, 'utf-8');

      // Enviar webhook si está configurado
      await this.sendWebhook(trace);

      return trace;
    } catch (error) {
      console.error('Error logging HTTP trace:', error);
      return trace;
    }
  }

  /**
   * Envía la traza al webhook configurado
   */
  private async sendWebhook(trace: HttpTrace): Promise<void> {
    const webhookUrl = process.env.WEBHOOK_URL;
    
    // Skip si no hay webhook configurado o es el placeholder
    if (!webhookUrl || webhookUrl === 'your_webhook_url_here') {
      return;
    }

    // Validar que sea una URL válida
    try {
      new URL(webhookUrl);
    } catch {
      console.warn('Invalid webhook URL configured, skipping webhook');
      return;
    }

    try {
      const payload: WebhookPayload = {
        event: trace.status >= 400 ? 'error' : 'success',
        trace,
        metadata: {
          environment: process.env.NODE_ENV || 'development',
          service: 'movie-dashboard',
          version: '1.0.0',
        },
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MovieDashboard/1.0.0',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000), // 5 segundos timeout
      });

      if (!response.ok) {
        console.warn(`Webhook failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Webhook error:', error);
    }
  }

  /**
   * Lee las últimas trazas del archivo de log
   */
  async getRecentTraces(limit: number = 100): Promise<HttpTrace[]> {
    try {
      await this.ensureLogDir();
      
      if (!existsSync(this.traceFile)) {
        return [];
      }

      const { readFile } = await import('fs/promises');
      const content = await readFile(this.traceFile, 'utf-8');
      const lines = content.trim().split('\n').filter(Boolean);
      
      return lines
        .slice(-limit)
        .map(line => {
          try {
            return JSON.parse(line) as HttpTrace;
          } catch {
            return null;
          }
        })
        .filter((trace): trace is HttpTrace => trace !== null)
        .reverse(); // Más recientes primero
    } catch (error) {
      console.error('Error reading traces:', error);
      return [];
    }
  }

  /**
   * Limpia logs antiguos (más de 7 días)
   */
  async cleanOldLogs(): Promise<void> {
    try {
      const traces = await this.getRecentTraces(10000);
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      
      const recentTraces = traces.filter(trace => 
        new Date(trace.timestamp).getTime() > weekAgo
      );

      if (recentTraces.length < traces.length) {
        const content = recentTraces
          .map(trace => JSON.stringify(trace))
          .join('\n') + '\n';
        
        await writeFile(this.traceFile, content, 'utf-8');
        console.log(`Cleaned ${traces.length - recentTraces.length} old log entries`);
      }
    } catch (error) {
      console.error('Error cleaning old logs:', error);
    }
  }
}

// Instancia singleton del logger
export const logger = new Logger();

// Función helper para medir tiempo de ejecución
export function measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  return fn().then(result => ({
    result,
    duration: Math.round(performance.now() - start)
  }));
}
