/**
 * Resumen de Estadísticas - Componente para mostrar métricas clave del dashboard
 * 
 * Patrón de diseño: Presentational Component
 * - Muestra estadísticas de manera visual y atractiva
 * - Cards con iconos y colores cinematográficos
 * - Animaciones suaves y responsive
 */

'use client';

import { Film, TrendingUp, Star, Calendar, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsOverviewProps {
  /** Estadísticas calculadas */
  stats: {
    totalMovies: number;
    monthsAnalyzed: number;
    genresFound: number;
    topMoviesCount: number;
    averagePopularity: number;
    averageRating: number;
  } | null;
  /** Si está cargando */
  isLoading?: boolean;
  /** Título de la sección */
  title?: string;
}

/**
 * Configuración de las métricas con iconos y colores
 */
const METRICS_CONFIG = [
  {
    key: 'totalMovies',
    label: 'Películas Analizadas',
    icon: Film,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    format: (value: number) => value.toLocaleString(),
  },
  {
    key: 'averagePopularity',
    label: 'Popularidad Promedio',
    icon: TrendingUp,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    format: (value: number) => Math.round(value).toLocaleString(),
  },
  {
    key: 'averageRating',
    label: 'Calificación Promedio',
    icon: Star,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    format: (value: number) => `${value.toFixed(1)}/10`,
  },
  {
    key: 'monthsAnalyzed',
    label: 'Períodos Mensuales',
    icon: Calendar,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    format: (value: number) => `${value} meses`,
  },
  {
    key: 'genresFound',
    label: 'Géneros Encontrados',
    icon: Users,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    format: (value: number) => `${value} géneros`,
  },
  {
    key: 'topMoviesCount',
    label: 'Top Películas',
    icon: Award,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    format: (value: number) => `Top ${value}`,
  },
] as const;

/**
 * Componente de skeleton para estado de carga
 */
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="cinema-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Componente principal de estadísticas
 */
export function StatsOverview({ 
  stats, 
  isLoading = false, 
  title = 'Resumen del Dashboard' 
}: StatsOverviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold cinema-text-gradient">{title}</h2>
          <Badge variant="outline" className="animate-pulse">Cargando...</Badge>
        </div>
        <StatsSkeleton />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold text-muted-foreground">{title}</h2>
          <Badge variant="outline">Sin datos</Badge>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Film className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No hay estadísticas disponibles</p>
          <p className="text-sm">Selecciona algunos filtros para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Título de la sección */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold cinema-text-gradient">{title}</h2>
        <Badge variant="default" className="cinema-glow">
          Actualizado
        </Badge>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {METRICS_CONFIG.map((metric) => {
          const IconComponent = metric.icon;
          const value = stats[metric.key as keyof typeof stats] as number;
          
          return (
            <Card 
              key={metric.key} 
              className="cinema-card hover:cinema-glow transition-all duration-300 cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Icono con fondo */}
                  <div className={`p-2 rounded-lg ${metric.bgColor} group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  
                  {/* Datos */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium truncate">
                      {metric.label}
                    </p>
                    <p className={`text-lg font-bold ${metric.color} group-hover:scale-105 transition-transform origin-left`}>
                      {metric.format(value)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Análisis Completado</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Dashboard actualizado con {stats.totalMovies.toLocaleString()} películas analizadas 
          a través de {stats.monthsAnalyzed} períodos mensuales, 
          cubriendo {stats.genresFound} géneros diferentes.
        </p>
      </div>
    </div>
  );
}
