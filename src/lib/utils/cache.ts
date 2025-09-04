/**
 * Sistema de caché en memoria para datos de TMDB
 */

import type { CacheEntry, CacheConfig } from '../types';

class MemoryCache {
  private cache = new Map<string, CacheEntry>();
  private timers = new Map<string, NodeJS.Timeout>();

  /**
   * Obtiene un elemento del caché
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar si ha expirado
    if (Date.now() > entry.timestamp + entry.ttl * 1000) {
      this.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Establece un elemento en el caché
   */
  set<T>(key: string, data: T, config: CacheConfig): void {
    // Limpiar timer existente si existe
    const existingTimer = this.timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: config.ttl,
      key,
      tags: config.tags,
    };

    this.cache.set(key, entry);

    // Configurar auto-eliminación
    const timer = setTimeout(() => {
      this.delete(key);
    }, config.ttl * 1000);

    this.timers.set(key, timer);
  }

  /**
   * Elimina un elemento del caché
   */
  delete(key: string): boolean {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }

    return this.cache.delete(key);
  }

  /**
   * Verifica si existe una clave en el caché
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Verificar si ha expirado
    if (Date.now() > entry.timestamp + entry.ttl * 1000) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Limpia elementos por tags
   */
  clearByTags(tags: string[]): number {
    let cleared = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags && entry.tags.some(tag => tags.includes(tag))) {
        this.delete(key);
        cleared++;
      }
    }

    return cleared;
  }

  /**
   * Limpia todo el caché
   */
  clear(): void {
    // Limpiar todos los timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Obtiene estadísticas del caché
   */
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.values());
    const validEntries = entries.filter(entry => 
      now <= entry.timestamp + entry.ttl * 1000
    );

    return {
      totalEntries: this.cache.size,
      validEntries: validEntries.length,
      expiredEntries: entries.length - validEntries.length,
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  /**
   * Estima el uso de memoria del caché
   */
  private estimateMemoryUsage(): number {
    let size = 0;
    
    for (const entry of this.cache.values()) {
      size += JSON.stringify(entry).length * 2; // Aproximación en bytes
    }

    return size;
  }

  /**
   * Limpia entradas expiradas
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl * 1000) {
        this.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Instancia singleton del caché
export const cache = new MemoryCache();

// Configuraciones predefinidas de caché
export const CACHE_CONFIGS = {
  GENRES: {
    ttl: 600, // 10 minutos
    key: 'tmdb:genres',
    tags: ['tmdb', 'genres'] as string[],
  },
  MOVIES_DISCOVER: {
    ttl: 300, // 5 minutos
    key: 'tmdb:movies:discover',
    tags: ['tmdb', 'movies'] as string[],
  },
  MOVIE_DETAILS: {
    ttl: 1800, // 30 minutos
    key: 'tmdb:movie:details',
    tags: ['tmdb', 'movie', 'details'] as string[],
  },
};

// Función helper para generar claves de caché
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {} as Record<string, any>);

  const paramsString = JSON.stringify(sortedParams);
  return `${prefix}:${Buffer.from(paramsString).toString('base64')}`;
}

// Función helper para caché con función de carga
export async function cacheWithLoader<T>(
  key: string,
  config: CacheConfig,
  loader: () => Promise<T>
): Promise<T> {
  // Intentar obtener del caché
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Cargar datos y almacenar en caché
  const data = await loader();
  cache.set(key, data, config);
  
  return data;
}

// Programar limpieza automática cada 5 minutos
if (typeof window === 'undefined') {
  setInterval(() => {
    const cleaned = cache.cleanup();
    if (cleaned > 0) {
      console.log(`Cache cleanup: removed ${cleaned} expired entries`);
    }
  }, 5 * 60 * 1000);
}
