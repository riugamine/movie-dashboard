/**
 * Placeholder de Gráficos - Componente temporal para mostrar estructura de visualizaciones
 * 
 * Este componente será reemplazado por las visualizaciones reales en el paso 5
 */

'use client';

import { BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DashboardData } from '@/lib/types';

interface ChartsPlaceholderProps {
  /** Datos transformados del dashboard */
  dashboardData: DashboardData | null;
  /** Si está cargando */
  isLoading?: boolean;
}

/**
 * Configuración de los gráficos que implementaremos
 */
const CHARTS_CONFIG = [
  {
    id: 'monthly-popularity',
    title: 'Popularidad Mensual',
    description: 'Evolución de la popularidad promedio por mes',
    icon: LineChart,
    type: 'Gráfico de Línea/Área',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    id: 'monthly-votes',
    title: 'Votación Mensual',
    description: 'Promedio de votación por período mensual',
    icon: TrendingUp,
    type: 'Gráfico de Línea',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 'top-movies',
    title: 'Top 10 Películas',
    description: 'Películas más populares por popularidad',
    icon: BarChart3,
    type: 'Gráfico de Barras',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    id: 'genre-distribution',
    title: 'Distribución por Género',
    description: 'Porcentaje de películas por género',
    icon: PieChart,
    type: 'Gráfico de Dona',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
] as const;

/**
 * Componente placeholder individual
 */
function ChartPlaceholder({ 
  chart, 
  dataCount 
}: { 
  chart: (typeof CHARTS_CONFIG)[number]; 
  dataCount: number;
}) {
  const IconComponent = chart.icon;

  return (
    <Card className="cinema-card h-80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className={`h-5 w-5 ${chart.color}`} />
            <CardTitle className="text-lg font-semibold">{chart.title}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {chart.type}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{chart.description}</p>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          {/* Icono grande con animación */}
          <div className={`p-6 rounded-full ${chart.bgColor} mx-auto w-fit animate-pulse`}>
            <IconComponent className={`h-12 w-12 ${chart.color}`} />
          </div>

          {/* Información del gráfico */}
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Próximamente</h3>
            <p className="text-sm text-muted-foreground">
              {dataCount > 0 
                ? `Listo para mostrar datos de ${dataCount} elementos`
                : 'Esperando datos para visualizar'
              }
            </p>
            
            {/* Indicador de datos */}
            {dataCount > 0 && (
              <div className="flex items-center justify-center gap-1 text-xs text-primary">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                <span>Datos cargados</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente principal de placeholders
 */
export function ChartsPlaceholder({ dashboardData, isLoading = false }: ChartsPlaceholderProps) {
  // Contar datos disponibles para cada gráfico
  const dataCounts = {
    'monthly-popularity': dashboardData?.monthly_data.length || 0,
    'monthly-votes': dashboardData?.monthly_data.length || 0,
    'top-movies': dashboardData?.top_movies.length || 0,
    'genre-distribution': dashboardData?.genre_distribution.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Título de la sección */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold cinema-text-gradient">
            Visualizaciones de Datos
          </h2>
          {isLoading && (
            <Badge variant="outline" className="animate-pulse">
              Cargando datos...
            </Badge>
          )}
        </div>

        <Badge variant="secondary" className="text-xs">
          Paso 5 - En desarrollo
        </Badge>
      </div>

      {/* Grid de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CHARTS_CONFIG.map((chart) => (
          <ChartPlaceholder
            key={chart.id}
            chart={chart}
            dataCount={dataCounts[chart.id as keyof typeof dataCounts]}
          />
        ))}
      </div>

      {/* Información sobre las transformaciones */}
      <Card className="cinema-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium">Transformaciones Implementadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-accent rounded-full" />
                  <span>✅ Agregación Temporal (Mensual)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>✅ Cálculo de Cambio Porcentual</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-secondary rounded-full" />
                  <span>✅ Análisis de Ventana Móvil</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-accent rounded-full" />
                  <span>✅ Filtrado Top-N Películas</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>✅ Unión de Nombres de Géneros</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
