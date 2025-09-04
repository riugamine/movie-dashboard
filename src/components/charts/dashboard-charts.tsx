/**
 * Dashboard Charts - Integrador de todas las visualizaciones
 * 
 * Patrón de diseño: Container Component
 * - Organiza las 4 visualizaciones requeridas
 * - Maneja estados de loading y error
 * - Layout responsive y adaptativo
 */

'use client';

import { BarChart3, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MonthlyPopularityChart } from './monthly-popularity-chart';
import { MonthlyVotesChart } from './monthly-votes-chart';
import { TopMoviesChart } from './top-movies-chart';
import { GenreDistributionChart } from './genre-distribution-chart';
import type { DashboardData } from '@/lib/types';

interface DashboardChartsProps {
  /** Datos transformados del dashboard */
  dashboardData: DashboardData | null;
  /** Si está cargando */
  isLoading?: boolean;
  /** Título de la sección */
  title?: string;
}

/**
 * Componente principal de visualizaciones del dashboard
 */
export function DashboardCharts({ 
  dashboardData, 
  isLoading = false,
  title = "Visualizaciones de Datos"
}: DashboardChartsProps) {
  return (
    <div className="space-y-6">
      {/* Título de la sección */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold cinema-text-gradient">
            {title}
          </h2>
          {isLoading && (
            <Badge variant="outline" className="animate-pulse">
              Procesando datos...
            </Badge>
          )}
          {dashboardData && !isLoading && (
            <Badge variant="default" className="cinema-glow">
              4 visualizaciones activas
            </Badge>
          )}
        </div>
      </div>

      {/* Grid principal de visualizaciones */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Fila superior: Gráficos temporales */}
        <MonthlyPopularityChart 
          data={dashboardData?.monthly_data || []}
          isLoading={isLoading}
          height={300}
        />
        
        <MonthlyVotesChart 
          data={dashboardData?.monthly_data || []}
          isLoading={isLoading}
          height={300}
        />
        
        {/* Fila inferior: Rankings y distribución */}
        <TopMoviesChart 
          data={dashboardData?.top_movies || []}
          isLoading={isLoading}
          height={400}
          maxMovies={10}
        />
        
        <GenreDistributionChart 
          data={dashboardData?.genre_distribution || []}
          isLoading={isLoading}
          height={350}
          maxGenres={8}
        />
      </div>

      {/* Información sobre las transformaciones aplicadas */}
      {dashboardData && !isLoading && (
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-medium">Transformaciones Aplicadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-accent rounded-full" />
                    <span className="font-medium">Agregación Temporal</span>
                  </div>
                  <p>{dashboardData.monthly_data.length} períodos mensuales analizados</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="font-medium">Cambio Porcentual</span>
                  </div>
                  <p>Variaciones entre períodos consecutivos</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-secondary rounded-full" />
                    <span className="font-medium">Promedio Móvil</span>
                  </div>
                  <p>Tendencias suavizadas de 3 períodos</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-accent rounded-full" />
                    <span className="font-medium">Top-N Filtrado</span>
                  </div>
                  <p>{dashboardData.top_movies.length} películas más populares</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="font-medium">Unión de Géneros</span>
                  </div>
                  <p>{dashboardData.genre_distribution.length} géneros con nombres</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-secondary rounded-full" />
                    <span className="font-medium">Período Analizado</span>
                  </div>
                  <p>{dashboardData.date_range.start} - {dashboardData.date_range.end}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información técnica */}
      <div className="text-center text-xs text-muted-foreground">
        <p>
          Visualizaciones generadas con <strong>Recharts</strong> • 
          Datos procesados con <strong>5 transformaciones</strong> • 
          Actualización automática con filtros
        </p>
      </div>
    </div>
  );
}
