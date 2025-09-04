/**
 * Resumen de Estadísticas - Componente para mostrar métricas clave del dashboard
 * 
 * Patrón de diseño: Presentational Component
 * - Muestra estadísticas de manera visual y atractiva
 * - Cards con iconos y colores cinematográficos
 * - Animaciones suaves y responsive
 * - Estados de loading y error mejorados
 */

'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faChartLine, faStar, faCalendarDays, faUsers, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCardSkeleton } from '@/components/ui/skeleton';
import { StatsGrid } from '@/components/layout/responsive-grid';

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
  /** Si mostrar animaciones */
  animated?: boolean;
}

/**
 * Configuración de las métricas con iconos y colores
 */
const METRICS_CONFIG = [
  {
    key: 'totalMovies',
    label: 'Películas Analizadas',
    icon: faFilm,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    glowColor: 'shadow-primary/20',
    format: (value: number) => value.toLocaleString(),
    description: 'Total de películas procesadas'
  },
  {
    key: 'averagePopularity',
    label: 'Popularidad Promedio',
    icon: faChartLine,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    glowColor: 'shadow-accent/20',
    format: (value: number) => Math.round(value).toLocaleString(),
    description: 'Índice promedio de popularidad'
  },
  {
    key: 'averageRating',
    label: 'Calificación Promedio',
    icon: faStar,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    glowColor: 'shadow-secondary/20',
    format: (value: number) => `${value.toFixed(1)}/10`,
    description: 'Calificación promedio de usuarios'
  },
  {
    key: 'monthsAnalyzed',
    label: 'Períodos Mensuales',
    icon: faCalendarDays,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    glowColor: 'shadow-primary/20',
    format: (value: number) => `${value} meses`,
    description: 'Períodos temporales analizados'
  },
  {
    key: 'genresFound',
    label: 'Géneros Encontrados',
    icon: faUsers,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    glowColor: 'shadow-accent/20',
    format: (value: number) => `${value} géneros`,
    description: 'Variedad de géneros disponibles'
  },
  {
    key: 'topMoviesCount',
    label: 'Top Películas',
    icon: faTrophy,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    glowColor: 'shadow-secondary/20',
    format: (value: number) => `Top ${value}`,
    description: 'Películas destacadas mostradas'
  },
] as const;

/**
 * Componente individual de métrica
 */
function StatCard({ 
  metric, 
  value, 
  animated = true 
}: { 
  metric: typeof METRICS_CONFIG[number];
  value: number;
  animated?: boolean;
}) {
  return (
    <Card className={`cinema-card hover:shadow-lg ${metric.glowColor} transition-all duration-300 group ${animated ? 'hover:scale-105' : ''}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${metric.bgColor} group-hover:scale-110 transition-transform duration-300`}>
            <FontAwesomeIcon 
              icon={metric.icon} 
              className={`h-4 w-4 sm:h-5 sm:w-5 ${metric.color}`} 
            />
          </div>
          <Badge 
            variant="outline" 
            className="text-xs opacity-70 group-hover:opacity-100 transition-opacity"
          >
            Actualizado
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className={`text-2xl sm:text-3xl font-bold ${metric.color} group-hover:cinema-text-gradient transition-all duration-300`}>
            {metric.format(value)}
          </div>
          <div className="text-sm font-medium text-foreground">
            {metric.label}
          </div>
          <div className="text-xs text-muted-foreground">
            {metric.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente principal de resumen de estadísticas
 */
export function StatsOverview({ 
  stats, 
  isLoading = false, 
  title = "Resumen del Dashboard",
  animated = true
}: StatsOverviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-primary/20 rounded-full animate-pulse" />
          <div className="h-6 w-48 bg-primary/10 rounded animate-pulse" />
        </div>
        <StatsGrid>
          {Array.from({ length: 6 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </StatsGrid>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold cinema-text-gradient">
          {title}
        </h2>
        <div className="text-center py-8 sm:py-12">
          <div className="p-4 rounded-full bg-muted/20 w-16 h-16 mx-auto mb-4 animate-pulse">
            <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground">
            No hay estadísticas disponibles
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Los datos se cargarán cuando estén disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header con título y badge de estado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold cinema-text-gradient">
          {title}
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-muted-foreground">Datos en tiempo real</span>
        </div>
      </div>

      {/* Grid de estadísticas */}
      <StatsGrid>
        {METRICS_CONFIG.map((metric) => {
          const value = stats[metric.key as keyof typeof stats] as number;
          return (
            <StatCard
              key={metric.key}
              metric={metric}
              value={value}
              animated={animated}
            />
          );
        })}
      </StatsGrid>

      {/* Información adicional */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/50">
        <p>
          Estadísticas generadas a partir de {stats.totalMovies.toLocaleString()} películas • 
          Actualización automática cada 5 minutos
        </p>
      </div>
    </div>
  );
}