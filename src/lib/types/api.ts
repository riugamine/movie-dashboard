/**
 * Tipos para las APIs y logging del sistema
 */

// Respuesta estándar de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// Error de API
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Log de trazas HTTP
export interface HttpTrace {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  baseUrl: string;
  status: number;
  duration: number;
  payloadSize: number;
  responseSize: number;
  userAgent?: string;
  ip?: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  error?: string;
}

// Configuración de webhook
export interface WebhookConfig {
  url: string;
  enabled: boolean;
  retries: number;
  timeout: number;
}

// Payload del webhook
export interface WebhookPayload {
  event: 'api_call' | 'error' | 'success';
  trace: HttpTrace;
  metadata?: Record<string, any>;
}

// Configuración de caché
export interface CacheConfig {
  ttl: number; // Time to live en segundos
  key: string;
  tags?: string[];
}

// Entrada de caché
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
  tags?: string[];
}

// Parámetros de paginación
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Configuración de rate limiting
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

// Estado de rate limiting
export interface RateLimitState {
  remaining: number;
  resetTime: number;
  total: number;
}

// Métricas de API
export interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  requestsPerMinute: number;
  errorRate: number;
  lastUpdated: string;
}

// Configuración del servidor
export interface ServerConfig {
  tmdb: {
    apiKey: string;
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  webhook: WebhookConfig;
  cache: {
    genres: CacheConfig;
    movies: CacheConfig;
  };
  rateLimit: RateLimitConfig;
}
